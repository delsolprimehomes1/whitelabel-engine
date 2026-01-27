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
import { ShoppingCart, Filter, RefreshCw } from 'lucide-react';
import { useOrders, ORDER_STATUSES } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailsDialog } from '@/components/admin/OrderDetailsDialog';

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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
