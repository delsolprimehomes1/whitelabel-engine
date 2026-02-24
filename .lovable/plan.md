

## Add Stripe Checkout to Branded Pricing Cards

### What We're Building

When a customer clicks "Order Now" on any lead product card on a white-label pricing page (`/:slug`), they'll be redirected to a Stripe Checkout session. After payment, they land on a branded success page. An order record is created in the database for admin tracking.

This is a **guest checkout** flow — customers don't need to log in. They enter their email on Stripe's hosted checkout page.

---

### Technical Plan

#### 1. Backend Function: `create-checkout`

A new edge function at `supabase/functions/create-checkout/index.ts` that:

- Accepts: `company_id`, `company_slug`, `company_name`, `lead_product_id`, `lead_name`, `price_per_lead`, `quantity`, `page_path`
- Creates a Stripe Checkout session in `mode: "payment"` with:
  - Dynamic `line_items` using `price_data` (since lead products are in our DB, not Stripe products) with the product name, unit price, and quantity
  - Metadata: `company_id`, `company_slug`, `company_name`, `lead_type`, `lead_product_id`, `quantity`, `page_path`, `domain_source`, `timestamp`
  - `success_url` pointing to `/{slug}/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url` pointing back to `/{slug}`
- Creates a pending order in the `orders` table with a matching `order_items` row
- Stores the `stripe_session_id` on the order
- Returns the Stripe checkout URL

Config update in `supabase/config.toml`:
```toml
[functions.create-checkout]
verify_jwt = false
```

#### 2. Backend Function: `verify-payment`

A new edge function at `supabase/functions/verify-payment/index.ts` that:

- Accepts: `session_id`
- Retrieves the Stripe Checkout session
- If payment succeeded, updates the order status from `pending` to `completed` and stores the `stripe_payment_intent_id`
- Returns the order details for the success page

Config update:
```toml
[functions.verify-payment]
verify_jwt = false
```

#### 3. Frontend: Wire Up the Buy Button

**Modify `src/components/branded/BrandedPricingCard.tsx`:**
- The `onOrder` callback already exists and is wired to the CTA button
- No changes needed in this file

**Modify `src/pages/BrandedPricing.tsx`:**
- Update `handleOrder` to call `supabase.functions.invoke('create-checkout')` with all required metadata
- On success, redirect to the Stripe checkout URL via `window.location.href`
- Show a loading/spinner state on the button while the checkout session is being created

#### 4. Success Page

**Create `src/pages/CheckoutSuccess.tsx`:**
- Reads `session_id` from URL query params
- Calls `supabase.functions.invoke('verify-payment')` to confirm payment and update order status
- Shows a branded confirmation with:
  - Company logo and name (fetched via slug)
  - "Payment Successful" message
  - Order summary (lead type, quantity, total)
  - Company contact email link
- Styled to match the branded page theme (dark/light mode, company colors)

**Update `src/App.tsx`:**
- Add route: `/:slug/success` → `CheckoutSuccess`
- Place it before the `/:slug` catch-all route

#### 5. Database

No schema changes needed. The existing `orders` and `order_items` tables already have all required columns (`stripe_session_id`, `stripe_payment_intent_id`, `company_id`, `company_slug`, `status`, etc.).

RLS: The edge functions use the service role key (`SUPABASE_SERVICE_ROLE_KEY` already configured) to insert/update orders, so no new RLS policies are needed for the public checkout flow.

---

### Flow Summary

```text
Customer clicks "Order Now"
  → Frontend calls create-checkout edge function
  → Edge function creates Stripe session + pending order
  → Customer redirected to Stripe Checkout
  → Customer pays
  → Stripe redirects to /{slug}/success?session_id=...
  → Success page calls verify-payment edge function
  → Order status updated to "completed"
  → Customer sees confirmation
  → Admin sees new order in dashboard (real-time)
```

### Files to Create
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/verify-payment/index.ts`
- `src/pages/CheckoutSuccess.tsx`

### Files to Modify
- `supabase/config.toml` — add function configs
- `src/pages/BrandedPricing.tsx` — update `handleOrder`
- `src/App.tsx` — add success route

