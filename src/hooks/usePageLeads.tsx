import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PageLead {
  id: string;
  company_id: string;
  lead_product_id: string;
  custom_price: number | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type PageLeadInsert = Omit<PageLead, 'id' | 'created_at' | 'updated_at'>;
export type PageLeadUpdate = Partial<Omit<PageLeadInsert, 'company_id' | 'lead_product_id'>>;

export function useCompanyPageLeads(companyId: string | undefined) {
  return useQuery({
    queryKey: ['page-leads', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('page_leads')
        .select('*')
        .eq('company_id', companyId)
        .order('display_order');

      if (error) throw error;
      return data as PageLead[];
    },
    enabled: !!companyId,
  });
}

export function useAllPageLeadsCounts() {
  return useQuery({
    queryKey: ['page-leads-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_leads')
        .select('company_id, is_visible');

      if (error) throw error;

      // Count visible page leads per company
      const counts: Record<string, number> = {};
      data?.forEach((pl) => {
        if (pl.is_visible) {
          counts[pl.company_id] = (counts[pl.company_id] || 0) + 1;
        }
      });
      return counts;
    },
  });
}

export function useUpsertPageLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      pageLeads,
    }: {
      companyId: string;
      pageLeads: {
        lead_product_id: string;
        custom_price: number | null;
        display_order: number;
        is_visible: boolean;
      }[];
    }) => {
      // First, delete all existing page_leads for this company
      const { error: deleteError } = await supabase
        .from('page_leads')
        .delete()
        .eq('company_id', companyId);

      if (deleteError) throw deleteError;

      // Then insert all the new ones
      if (pageLeads.length > 0) {
        const { error: insertError } = await supabase.from('page_leads').insert(
          pageLeads.map((pl) => ({
            company_id: companyId,
            lead_product_id: pl.lead_product_id,
            custom_price: pl.custom_price,
            display_order: pl.display_order,
            is_visible: pl.is_visible,
          }))
        );

        if (insertError) throw insertError;
      }
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['page-leads', companyId] });
      toast.success('Page leads updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update page leads: ' + error.message);
    },
  });
}
