import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Plus, RefreshCw } from 'lucide-react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import {
  useLeadProducts,
  useCreateLeadProduct,
  useUpdateLeadProduct,
  useDeleteLeadProduct,
  useReorderLeadProducts,
  LeadProduct,
  LeadProductInsert,
} from '@/hooks/useLeadProducts';

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LeadProduct | null>(null);

  const { data: products, isLoading, refetch } = useLeadProducts();
  const createMutation = useCreateLeadProduct();
  const updateMutation = useUpdateLeadProduct();
  const deleteMutation = useDeleteLeadProduct();
  const reorderMutation = useReorderLeadProducts();

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: LeadProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: LeadProductInsert) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, updates: data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingProduct(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReorder = (reorderData: { id: string; display_order: number }[]) => {
    reorderMutation.mutate(reorderData);
  };

  return (
    <AdminLayout title="Lead Products" description="Manage your lead product offerings">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lead Products
            </CardTitle>
            <CardDescription>
              Define lead types, pricing, and features. Drag to reorder.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <ProductsTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
              isDeleting={deleteMutation.isPending}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No products yet</p>
              <p className="text-sm">Create your first lead product to get started.</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </AdminLayout>
  );
}
