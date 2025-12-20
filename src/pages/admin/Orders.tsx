import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function Orders() {
  return (
    <AdminLayout title="Orders" description="View and manage customer orders">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Orders
          </CardTitle>
          <CardDescription>
            Track orders and revenue from all pricing pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Order management will be implemented in Phase 4 with Stripe
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
