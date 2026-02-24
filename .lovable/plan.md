
Issue diagnosis (based on your screenshot + backend logs)
- The checkout page fails at initialization because the backend function is still sending `receipt_email: ""` (empty string) to Stripe when creating the Payment Intent.
- Stripe rejects that with `email_invalid` (`param: receipt_email`), which causes the frontend to show: “Failed to initialize checkout. Please try again.”
- This matches the live error logs exactly, so the root cause is confirmed.

Implementation plan to fix it

1) Harden `create-payment-intent` email handling (primary fix)
- File: `supabase/functions/create-payment-intent/index.ts`
- Keep email optional for PaymentIntent creation, but normalize it before use:
  - Trim incoming `customer_email`
  - Validate format only if present
  - Include `receipt_email` in Stripe request only when valid and non-empty
- If email is missing/blank at init time, do not pass `receipt_email` at all.

2) Prevent blank values from being stored in pending orders
- File: `supabase/functions/create-payment-intent/index.ts`
- Store `customer_email` as `null` instead of `''` when empty.
- Store `customer_name` as `null` when empty/whitespace.
- This avoids dirty data and keeps success-page messaging cleaner.

3) Minor frontend payload cleanup (defensive)
- File: `src/pages/BrandedCheckout.tsx`
- In the initial call that creates the PaymentIntent, send `customer_email: null` / `customer_name: null` (or omit) instead of empty strings.
- This aligns frontend payload semantics with backend optional behavior.

4) Optional reliability improvement (recommended while touching checkout)
- File: `supabase/functions/verify-payment/index.ts`
- When verifying by `payment_intent_id`, read billing email/name from Stripe (if present) and backfill order fields when they are null.
- This ensures order records and confirmation messaging stay accurate for custom checkout.

5) Validation and test plan
- End-to-end tests:
  1. Open branded pricing page
  2. Click Order Now
  3. Confirm checkout page loads (no initialization error)
  4. Enter email + card test number `4242 4242 4242 4242`
  5. Confirm redirect to `/:slug/success` and order marked completed
- Negative/edge tests:
  - Refresh direct checkout with valid state path
  - Ensure no `email_invalid` appears in backend logs
  - Ensure pending orders no longer store blank-string email/name

Technical details (exact logic to implement)

```text
create-payment-intent:
  normalizedEmail = typeof customer_email === 'string' ? customer_email.trim() : ''
  hasValidEmail = normalizedEmail matches email regex

  paymentIntentPayload = {
    amount,
    currency: 'usd',
    metadata: ...
    ...(hasValidEmail ? { receipt_email: normalizedEmail } : {})
  }

  order insert:
    customer_email: hasValidEmail ? normalizedEmail : null
    customer_name: normalizedName.length ? normalizedName : null
```

Scope and impact
- No database schema changes.
- No auth/RLS changes required.
- This is a backward-compatible fix for the custom branded checkout flow and directly resolves your current error.
