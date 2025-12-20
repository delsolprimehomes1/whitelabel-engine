import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Package, ShoppingCart, DollarSign } from 'lucide-react';

interface Stats {
  companiesCount: number;
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    companiesCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companiesRes, productsRes, ordersRes] = await Promise.all([
          supabase.from('companies').select('id', { count: 'exact', head: true }),
          supabase.from('lead_products').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id, total_amount'),
        ]);

        const totalRevenue = ordersRes.data?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0;

        setStats({
          companiesCount: companiesRes.count || 0,
          productsCount: productsRes.count || 0,
          ordersCount: ordersRes.data?.length || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Companies',
      value: stats.companiesCount,
      description: 'Active pricing pages',
      icon: Building2,
    },
    {
      title: 'Lead Products',
      value: stats.productsCount,
      description: 'Available lead types',
      icon: Package,
    },
    {
      title: 'Orders',
      value: stats.ordersCount,
      description: 'Total orders placed',
      icon: ShoppingCart,
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: 'Total revenue',
      icon: DollarSign,
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of your white-label pricing system">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with your white-label pricing system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Create Lead Products</p>
                <p className="text-sm text-muted-foreground">
                  Define your lead types with pricing and features
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Add Companies</p>
                <p className="text-sm text-muted-foreground">
                  Create companies with unique slugs for their pricing pages
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Configure Branding</p>
                <p className="text-sm text-muted-foreground">
                  Customize colors, logos, and styling for each company
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                4
              </div>
              <div>
                <p className="font-medium">Share Pricing Pages</p>
                <p className="text-sm text-muted-foreground">
                  Each company gets /leads/company-slug
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Stripe Integration</span>
              <span className="text-sm font-medium text-muted-foreground">Not configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <span className="text-sm font-medium text-green-600">Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
