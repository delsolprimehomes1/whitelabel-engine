import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter, RefreshCw, Download } from 'lucide-react';
import { useOrders, ORDER_STATUSES, OrderWithDetails } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailsDialog } from '@/components/admin/OrderDetailsDialog';
import { exportToCsv } from '@/lib/exportCsv';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Orders() {
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { companies } = useCompanies();
  const { data: orders, isLoading, refetch } = useOrders({
    companyId: companyFilter !== 'all' ? companyFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailsOpen(true);
  };

  const handleClearFilters = () => {
    setCompanyFilter('all');
    setStatusFilter('all');
  };

  const hasFilters = companyFilter !== 'all' || statusFilter !== 'all';

  const handleExportCsv = () => {
    if (!orders || orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const columns: { key: keyof OrderWithDetails; header: string; format?: (value: unknown) => string }[] = [
      { key: 'id', header: 'Order ID' },
      { key: 'created_at', header: 'Date', format: (v) => format(new Date(v as string), 'yyyy-MM-dd HH:mm:ss') },
      { key: 'customer_name', header: 'Customer Name', format: (v) => (v as string) || '' },
      { key: 'customer_email', header: 'Customer Email', format: (v) => (v as string) || '' },
      { key: 'company_name', header: 'Company', format: (v) => (v as string) || '' },
      { key: 'company_slug', header: 'Company Slug' },
      { key: 'total_amount', header: 'Amount', format: (v) => (v as number).toFixed(2) },
      { key: 'status', header: 'Status' },
      { key: 'stripe_session_id', header: 'Stripe Session', format: (v) => (v as string) || '' },
      { key: 'domain_source', header: 'Source', format: (v) => (v as string) || 'Direct' },
    ];

    const filename = `orders-export-${format(new Date(), 'yyyy-MM-dd')}`;
    exportToCsv(orders, filename, columns);
    toast.success(`Exported ${orders.length} orders to CSV`);
  };

  return (
    <AdminLayout title="Orders" description="View and manage customer orders">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orders
              </CardTitle>
              <CardDescription>
                Track orders and revenue from all pricing pages
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                disabled={!orders || orders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              {orders?.length ?? 0} order{(orders?.length ?? 0) !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Orders Table */}
          <OrdersTable
            orders={orders ?? []}
            isLoading={isLoading}
            onViewOrder={handleViewOrder}
          />
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        orderId={selectedOrderId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </AdminLayout>
  );
}
