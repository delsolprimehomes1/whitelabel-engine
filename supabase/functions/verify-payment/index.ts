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
    const { session_id, payment_intent_id } = await req.json();
    if (!session_id && !payment_intent_id) throw new Error("Missing session_id or payment_intent_id");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle PaymentIntent-based verification (custom checkout)
    if (payment_intent_id) {
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (paymentIntent.status === "succeeded") {
        // Backfill customer details from Stripe if missing
        const stripeEmail = paymentIntent.receipt_email || paymentIntent.latest_charge?.billing_details?.email || null;
        const updatePayload: Record<string, unknown> = { status: "completed" };
        if (stripeEmail) updatePayload.customer_email = stripeEmail;

        const { data: order, error: updateError } = await supabaseAdmin
          .from("orders")
          .update(updatePayload)
          .eq("stripe_payment_intent_id", payment_intent_id)
          .select("*, order_items(*)")
          .single();

        if (updateError) {
          console.error("Order update error:", updateError);
          throw new Error("Failed to update order");
        }

        return new Response(
          JSON.stringify({
            success: true,
            order: {
              id: order.id,
              status: order.status,
              total_amount: order.total_amount,
              customer_email: order.customer_email,
              customer_name: order.customer_name,
              company_slug: order.company_slug,
              items: order.order_items,
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      return new Response(
        JSON.stringify({ success: false, status: paymentIntent.status }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Handle Checkout Session-based verification (legacy)
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const { data: order, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
          customer_email: session.customer_details?.email || null,
          customer_name: session.customer_details?.name || null,
        })
        .eq("stripe_session_id", session_id)
        .select("*, order_items(*)")
        .single();

      if (updateError) {
        console.error("Order update error:", updateError);
        throw new Error("Failed to update order");
      }

      return new Response(
        JSON.stringify({
          success: true,
          order: {
            id: order.id,
            status: order.status,
            total_amount: order.total_amount,
            customer_email: order.customer_email,
            customer_name: order.customer_name,
            company_slug: order.company_slug,
            items: order.order_items,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, status: session.payment_status }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
