import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  order_id: string;
  lead_product_id: string | null;
  lead_name: string;
  quantity: number;
  price_per_lead: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  company_id: string | null;
  company_slug: string;
  customer_email: string | null;
  customer_name: string | null;
  status: string;
  total_amount: number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  page_path: string | null;
  domain_source: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails extends Order {
  company_name?: string;
  items?: OrderItem[];
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'refunded', label: 'Refunded', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

export function useOrders(filters?: { 
  companyId?: string; 
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const queryClient = useQueryClient();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          // Invalidate queries to refetch with updated data
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          
          // Show toast for new orders
          if (payload.eventType === 'INSERT') {
            toast.success('New order received!', {
              description: `Order #${(payload.new as Order).id.slice(0, 8)}...`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async (): Promise<OrderWithDetails[]> => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.companyId) {
        query = query.eq('company_id', filters.companyId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom.toISOString());
      }

      if (filters?.dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      // Fetch company names for all orders
      const companyIds = [...new Set(orders?.map((o) => o.company_id).filter(Boolean))];
      
      let companyMap: Record<string, string> = {};
      if (companyIds.length > 0) {
        const { data: companies } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds as string[]);
        
        companyMap = (companies || []).reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});
      }

      return (orders || []).map((order) => ({
        ...order,
        company_name: order.company_id ? companyMap[order.company_id] : undefined,
      }));
    },
  });
}

export function useOrderDetails(orderId: string | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<OrderWithDetails | null> => {
      if (!orderId) return null;

      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (error) throw error;
      if (!order) return null;

      // Fetch company name
      let companyName: string | undefined;
      if (order.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('name')
          .eq('id', order.company_id)
          .maybeSingle();
        companyName = company?.name;
      }

      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      return {
        ...order,
        company_name: companyName,
        items: items || [],
      };
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Order status updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });
}
