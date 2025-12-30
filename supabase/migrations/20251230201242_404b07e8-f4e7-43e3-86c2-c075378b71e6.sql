-- Create admin_invites table
CREATE TABLE public.admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Only admins can manage invites
CREATE POLICY "Admins can manage invites" 
ON public.admin_invites FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger function to auto-grant admin role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this email was pre-authorized as admin
  IF EXISTS (
    SELECT 1 FROM public.admin_invites 
    WHERE LOWER(email) = LOWER(NEW.email) AND is_used = false
  ) THEN
    -- Grant admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    -- Mark invite as used
    UPDATE public.admin_invites 
    SET is_used = true, used_at = now()
    WHERE LOWER(email) = LOWER(NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for new signups
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_check();