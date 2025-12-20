import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function Products() {
  return (
    <AdminLayout title="Lead Products" description="Manage your lead product offerings">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lead Products
          </CardTitle>
          <CardDescription>
            Define lead types, pricing, and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Product management will be implemented in Phase 2
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
