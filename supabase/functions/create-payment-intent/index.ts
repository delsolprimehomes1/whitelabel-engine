import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      company_id,
      company_slug,
      company_name,
      lead_product_id,
      lead_name,
      price_per_lead,
      quantity,
      page_path,
      customer_email,
      customer_name,
    } = await req.json();

    if (!company_slug || !lead_name || !price_per_lead || !quantity || !customer_email) {
      throw new Error("Missing required fields");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const totalAmount = Math.round(price_per_lead * quantity * 100); // cents

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      receipt_email: customer_email,
      metadata: {
        company_id: company_id || "",
        company_slug,
        company_name: company_name || "",
        lead_type: lead_name,
        lead_product_id: lead_product_id || "",
        quantity: String(quantity),
        price_per_lead: String(price_per_lead),
        page_path: page_path || "",
        domain_source: req.headers.get("origin") || "",
        timestamp: new Date().toISOString(),
      },
    });

    // Create pending order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        company_id: company_id || null,
        company_slug,
        total_amount: price_per_lead * quantity,
        status: "pending",
        stripe_payment_intent_id: paymentIntent.id,
        page_path: page_path || null,
        domain_source: req.headers.get("origin") || null,
        customer_email,
        customer_name: customer_name || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Create order item
    const { error: itemError } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: order.id,
        lead_product_id: lead_product_id || null,
        lead_name,
        quantity,
        price_per_lead,
        total_price: price_per_lead * quantity,
      });

    if (itemError) {
      console.error("Order item creation error:", itemError);
    }

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        order_id: order.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Create payment intent error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
