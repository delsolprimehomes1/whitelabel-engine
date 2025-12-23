-- Add standing order columns for products with dual pricing (like Internet Leads)
ALTER TABLE public.lead_products 
ADD COLUMN IF NOT EXISTS standing_order_price numeric,
ADD COLUMN IF NOT EXISTS standing_order_min_weeks integer DEFAULT 4,
ADD COLUMN IF NOT EXISTS standing_order_min_quantity integer;

-- Add category column for filtering
ALTER TABLE public.lead_products 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';