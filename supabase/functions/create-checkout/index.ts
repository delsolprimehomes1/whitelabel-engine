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
    } = await req.json();

    if (!company_slug || !lead_product_id || !lead_name || !price_per_lead || !quantity) {
      throw new Error("Missing required fields");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const origin = req.headers.get("origin") || "https://whitelabel-engine.lovable.app";
    const totalAmount = price_per_lead * quantity;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${lead_name} Leads`,
              description: `${quantity} leads for ${company_name || company_slug}`,
            },
            unit_amount: Math.round(price_per_lead * 100), // cents
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/${company_slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${company_slug}`,
      metadata: {
        company_id: company_id || "",
        company_slug,
        company_name: company_name || "",
        lead_type: lead_name,
        lead_product_id,
        quantity: String(quantity),
        page_path: page_path || `/${company_slug}`,
        domain_source: origin,
        timestamp: new Date().toISOString(),
      },
    });

    // Create pending order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        company_id: company_id || null,
        company_slug,
        total_amount: totalAmount,
        status: "pending",
        stripe_session_id: session.id,
        page_path: page_path || `/${company_slug}`,
        domain_source: origin,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order record");
    }

    // Create order item
    const { error: itemError } = await supabaseAdmin.from("order_items").insert({
      order_id: order.id,
      lead_product_id,
      lead_name,
      quantity,
      price_per_lead,
      total_price: totalAmount,
    });

    if (itemError) {
      console.error("Order item creation error:", itemError);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
