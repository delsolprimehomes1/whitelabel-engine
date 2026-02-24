

## Custom Branded Checkout Page

### Problem
The current flow redirects customers to Stripe's hosted checkout page, which shows Stripe/LifeCo branding instead of the white-label company's branding. This breaks the white-label experience.

### Solution
Replace the Stripe Checkout redirect with a custom in-app checkout page that collects customer info and card details using Stripe Elements, fully styled to match each company's branding.

### Architecture Change

```text
CURRENT FLOW:
  Click "Order Now" → Edge function creates Checkout Session → Redirect to stripe.com → Return to /slug/success

NEW FLOW:
  Click "Order Now" → Navigate to /:slug/checkout (in-app, branded) → Customer fills email + card
  → Edge function creates PaymentIntent → Stripe.js confirms payment client-side → Navigate to /:slug/success
```

### Technical Plan

#### 1. Add Stripe.js dependency
- Install `@stripe/stripe-js` and `@stripe/react-stripe-js` packages
- These provide the `Elements` provider and `CardElement` / `PaymentElement` components that render secure, PCI-compliant card input fields inside our branded page

#### 2. New Edge Function: `create-payment-intent`
**File:** `supabase/functions/create-payment-intent/index.ts`

Replaces the current `create-checkout` function's role for the branded flow:
- Accepts: `company_id`, `company_slug`, `company_name`, `lead_product_id`, `lead_name`, `price_per_lead`, `quantity`, `page_path`, `customer_email`, `customer_name`
- Creates a Stripe PaymentIntent with `amount` in cents and metadata
- Creates a pending order in the `orders` table with matching `order_items`
- Returns `client_secret` (needed by Stripe.js to confirm payment on the frontend)

Config: `verify_jwt = false` (guest checkout)

#### 3. Update Edge Function: `verify-payment`
- Add support for looking up orders by `stripe_payment_intent_id` (in addition to existing `stripe_session_id` lookup)
- The custom checkout confirms payment client-side, so we verify via PaymentIntent ID

#### 4. New Page: `/:slug/checkout`
**File:** `src/pages/BrandedCheckout.tsx`

A fully branded checkout page that:
- Receives order details via URL state/params (product name, quantity, price, company slug)
- Displays an order summary panel (matching the company's branding/colors/dark mode)
- Collects customer name and email in styled input fields
- Renders Stripe `PaymentElement` for card details (styled to match dark/light mode)
- On submit: calls `create-payment-intent` → uses `stripe.confirmPayment()` → redirects to `/:slug/success`
- Shows loading states and error handling
- Uses the Stripe publishable key (needs to be stored in the codebase as `VITE_STRIPE_PUBLISHABLE_KEY` since it's a public key)

#### 5. Update `BrandedPricing.tsx`
- Change `handleOrder` to navigate to `/:slug/checkout` with order details in route state instead of calling the edge function directly

#### 6. Update `src/App.tsx`
- Add route: `/:slug/checkout` → `BrandedCheckout`
- Place before the `/:slug` catch-all

#### 7. Stripe Publishable Key
- Your publishable key (`pk_live_...` or `pk_test_...`) is safe to store in code
- Will be added as a `VITE_STRIPE_PUBLISHABLE_KEY` environment variable or constant

### Files to Create
- `supabase/functions/create-payment-intent/index.ts`
- `src/pages/BrandedCheckout.tsx`

### Files to Modify
- `src/App.tsx` — add checkout route
- `src/pages/BrandedPricing.tsx` — navigate to checkout instead of redirect
- `supabase/functions/verify-payment/index.ts` — support PaymentIntent lookup

### What the Customer Sees
1. Branded pricing page → clicks "Order Now"
2. Branded checkout page with company logo, colors, dark/light mode
3. Enters name, email, card details (all on your domain)
4. Clicks "Pay $X.XX" → payment processes
5. Branded success page with order confirmation

No Stripe branding visible at any point.

### Requirement From You
I'll need your **Stripe publishable key** (`pk_test_...` or `pk_live_...`) to initialize Stripe.js on the frontend. This is a public key and safe to include in the code.

