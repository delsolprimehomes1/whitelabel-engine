

## Fix: "Failed to initialize checkout" Error

### Root Cause

The `create-payment-intent` edge function requires `customer_email` as a mandatory field (line 17 validation). But `BrandedCheckout.tsx` creates the PaymentIntent on page load with an empty string for `customer_email` (because the customer hasn't filled in the form yet). Empty string is falsy in JavaScript, so the validation throws "Missing required fields".

### Fix

**File: `supabase/functions/create-payment-intent/index.ts`**

Remove `customer_email` from the required fields validation. The email is collected later in the checkout form and passed to Stripe via `payment_method_data.billing_details` when the payment is confirmed.

Change the validation from:
```typescript
if (!company_slug || !lead_name || !price_per_lead || !quantity || !customer_email) {
```
To:
```typescript
if (!company_slug || !lead_name || !price_per_lead || !quantity) {
```

That's the only change needed. One line.

