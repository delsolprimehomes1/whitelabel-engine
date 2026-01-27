import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, subMonths, format, eachDayOfInterval, subDays } from 'date-fns';

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface CompanyStats {
  company_id: string;
  company_name: string;
  company_slug: string;
  total_revenue: number;
  total_orders: number;
}

interface AnalyticsData {
  dailyStats: DailyStats[];
  topCompanies: CompanyStats[];
  totals: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

export function useAnalytics(dateRange?: { from?: Date; to?: Date }) {
  return useQuery({
    queryKey: ['analytics', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async (): Promise<AnalyticsData> => {
      // Default to last 30 days if no range provided
      const endDate = dateRange?.to || new Date();
      const startDate = dateRange?.from || subDays(endDate, 30);

      // Fetch orders within date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, company_id, company_slug')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      // Fetch company names
      const companyIds = [...new Set(orders?.map(o => o.company_id).filter(Boolean))];
      let companyMap: Record<string, string> = {};
      
      if (companyIds.length > 0) {
        const { data: companies } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds as string[]);
        
        companyMap = (companies || []).reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});
      }

      // Calculate daily stats
      const dayInterval = eachDayOfInterval({ start: startDate, end: endDate });
      const dailyMap: Record<string, { revenue: number; orders: number }> = {};

      // Initialize all days with zero
      dayInterval.forEach(day => {
        dailyMap[format(day, 'yyyy-MM-dd')] = { revenue: 0, orders: 0 };
      });

      // Aggregate order data by day
      orders?.forEach(order => {
        const day = format(new Date(order.created_at), 'yyyy-MM-dd');
        if (dailyMap[day]) {
          dailyMap[day].revenue += order.total_amount || 0;
          dailyMap[day].orders += 1;
        }
      });

      const dailyStats: DailyStats[] = Object.entries(dailyMap).map(([date, stats]) => ({
        date,
        ...stats,
      }));

      // Calculate company stats
      const companyStatsMap: Record<string, CompanyStats> = {};
      
      orders?.forEach(order => {
        const key = order.company_id || order.company_slug;
        if (!companyStatsMap[key]) {
          companyStatsMap[key] = {
            company_id: order.company_id || '',
            company_name: order.company_id ? (companyMap[order.company_id] || order.company_slug) : order.company_slug,
            company_slug: order.company_slug,
            total_revenue: 0,
            total_orders: 0,
          };
        }
        companyStatsMap[key].total_revenue += order.total_amount || 0;
        companyStatsMap[key].total_orders += 1;
      });

      const topCompanies = Object.values(companyStatsMap)
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5);

      // Calculate totals
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;

      return {
        dailyStats,
        topCompanies,
        totals: {
          totalRevenue,
          totalOrders,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
      };
    },
  });
}
