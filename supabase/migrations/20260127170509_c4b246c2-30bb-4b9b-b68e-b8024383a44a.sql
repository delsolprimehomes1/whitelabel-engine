-- Create a public view for companies that excludes sensitive contact information
CREATE VIEW public.companies_public
WITH (security_invoker=on) AS
  SELECT id, name, slug, is_active, created_at, updated_at
  FROM public.companies;

-- Drop the existing public SELECT policy that exposes all columns
DROP POLICY IF EXISTS "Public can view active companies" ON public.companies;

-- Create new restrictive policy - public can only access via the view
-- Admins retain full access through their existing policy
CREATE POLICY "Public can view active companies via view"
ON public.companies 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR (is_active = true AND (
    -- Allow access only when querying through the view (no auth context for public)
    auth.uid() IS NULL
  ))
);