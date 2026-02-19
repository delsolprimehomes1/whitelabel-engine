
## Add "Why Choose" & "How It Works" Sections to White-Label Pricing Pages

### What's Being Added

The branded pricing page (`/leads/{slug}`) currently only shows a header and pricing cards. We'll enrich it with three new content sections below the pricing grid, all dynamically branded and using the company name:

1. **"Why Choose [Company Name] Leads"** — A feature grid with 6 benefit cards (Pre-Qualified Leads, Exclusive Leads, Real-Time Delivery, High Conversion Rate, Performance Tracking, CRM Integration), matching the reference screenshot style.

2. **"How It Works"** — A numbered 5-step horizontal process (Select Lead Type → Define Territory → Setup CRM → Receive Leads → Connect & Convert), matching the reference screenshot style.

3. **"What Makes [Company Name] Special?"** — A compact highlight section with two feature cards (Fresh Leads + Aged Leads) and a quality assurance badge pill, matching the first reference screenshot.

All sections adapt to the company's `primary_color`, `accent_color`, and `dark_mode` settings dynamically. No database changes are needed.

---

### Technical Plan

**File to modify: `src/pages/BrandedPricing.tsx`**

Add three new inline section components before the footer. All content is static but branded:

**Section 1 — "Why Choose [Company Name] Leads"**
- Gradient heading: first part uses `primary_color`, "Leads" word uses `accent_color`
- Subtitle paragraph
- 6-card grid (`CheckCircle`, `Shield`, `Clock`, `Zap`, `BarChart2`, `Users` icons from lucide-react)
- Each card: semi-transparent glassmorphism background, icon in a soft pill, title + description
- Responsive: 1 col mobile → 2 col tablet → 3 col desktop

**Section 2 — "How It Works"**
- Bold heading with font-weight treatment
- Subtitle
- 5-step horizontal scroll on mobile, row on desktop
- Each step: numbered badge styled with `primary_color`, step title in `primary_color`, description
- Steps connected visually with subtle dividers on desktop

**Section 3 — "What Makes [Company Name] Special?"**
- Rounded container card with subtle border
- Two feature cards side by side: `Sparkles` icon for Fresh Leads, `Clock` for Aged Leads
- Bottom quality assurance pill badge using `accent_color`

**Color adaptation logic:**
- Dark mode: card backgrounds use `rgba(255,255,255,0.04)`, borders `rgba(255,255,255,0.06)`, text white/dimmed
- Light mode: card backgrounds use `rgba(0,0,0,0.02)`, borders `rgba(0,0,0,0.05)`, text dark/dimmed

**Layout order on the page:**
```text
[Header: Logo + Company Name]
[Pricing Cards Grid]
── NEW SECTIONS BELOW ──
[What Makes X Special?]
[Why Choose X Leads]
[How It Works]
[Footer]
```

No new files, no database migrations, no new dependencies — everything is added inside `BrandedPricing.tsx` using icons already available from `lucide-react`.
