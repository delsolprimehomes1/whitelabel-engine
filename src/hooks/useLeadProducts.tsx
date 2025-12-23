import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LeadProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  conversion_rate: number | null;
  min_order_quantity: number;
  features: string[] | null;
  badge: string | null;
  cta_label: string;
  display_order: number;
  is_active: boolean;
  category: string | null;
  standing_order_price: number | null;
  standing_order_min_weeks: number | null;
  standing_order_min_quantity: number | null;
  created_at: string;
  updated_at: string;
}

export type LeadProductInsert = Omit<LeadProduct, 'id' | 'created_at' | 'updated_at'>;
export type LeadProductUpdate = Partial<LeadProductInsert>;

export function useLeadProducts() {
  return useQuery({
    queryKey: ['lead-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as LeadProduct[];
    },
  });
}

export function useActiveLeadProducts() {
  return useQuery({
    queryKey: ['lead-products', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as LeadProduct[];
    },
  });
}

export function useCreateLeadProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: LeadProductInsert) => {
      const { data, error } = await supabase
        .from('lead_products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-products'] });
      toast.success('Lead product created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create lead product: ' + error.message);
    },
  });
}

export function useUpdateLeadProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LeadProductUpdate }) => {
      const { data, error } = await supabase
        .from('lead_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-products'] });
      toast.success('Lead product updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update lead product: ' + error.message);
    },
  });
}

export function useDeleteLeadProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lead_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-products'] });
      toast.success('Lead product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete lead product: ' + error.message);
    },
  });
}

export function useReorderLeadProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (products: { id: string; display_order: number }[]) => {
      const updates = products.map(({ id, display_order }) =>
        supabase
          .from('lead_products')
          .update({ display_order })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-products'] });
    },
    onError: (error) => {
      toast.error('Failed to reorder products: ' + error.message);
    },
  });
}
