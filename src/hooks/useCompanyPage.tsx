import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyWithBranding {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  branding: {
    logo_url: string | null;
    primary_color: string;
    accent_color: string;
    cta_color: string;
    font_family: string | null;
    dark_mode: boolean;
  } | null;
}

export interface PageLeadProduct {
  id: string;
  custom_price: number | null;
  display_order: number;
  lead_product: {
    id: string;
    name: string;
    description: string | null;
    base_price: number;
    category: string | null;
    badge: string | null;
    features: string[] | null;
    cta_label: string;
    min_order_quantity: number;
    conversion_rate: number | null;
    standing_order_price: number | null;
    standing_order_min_quantity: number | null;
    standing_order_min_weeks: number | null;
  };
}

export function useCompanyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['company', slug],
    queryFn: async (): Promise<CompanyWithBranding | null> => {
      if (!slug) return null;

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (companyError) throw companyError;
      if (!company) return null;

      const { data: branding, error: brandingError } = await supabase
        .from('branding_configs')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();

      if (brandingError) throw brandingError;

      return {
        ...company,
        branding: branding
          ? {
              logo_url: branding.logo_url,
              primary_color: branding.primary_color,
              accent_color: branding.accent_color,
              cta_color: branding.cta_color,
              font_family: branding.font_family,
              dark_mode: branding.dark_mode,
            }
          : null,
      };
    },
    enabled: !!slug,
  });
}

export function usePageLeads(companyId: string | undefined) {
  return useQuery({
    queryKey: ['page-leads', companyId],
    queryFn: async (): Promise<PageLeadProduct[]> => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('page_leads')
        .select(`
          id,
          custom_price,
          display_order,
          lead_product:lead_products(
            id,
            name,
            description,
            base_price,
            category,
            badge,
            features,
            cta_label,
            min_order_quantity,
            conversion_rate,
            standing_order_price,
            standing_order_min_quantity,
            standing_order_min_weeks
          )
        `)
        .eq('company_id', companyId)
        .eq('is_visible', true)
        .order('display_order');

      if (error) throw error;

      // Filter out any page_leads where the lead_product join returned null
      return (data || [])
        .filter((item): item is PageLeadProduct => item.lead_product !== null)
        .map((item) => ({
          ...item,
          lead_product: item.lead_product as PageLeadProduct['lead_product'],
        }));
    },
    enabled: !!companyId,
  });
}
