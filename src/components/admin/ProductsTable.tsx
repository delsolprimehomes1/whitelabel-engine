import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { LeadProduct } from '@/hooks/useLeadProducts';

interface ProductsTableProps {
  products: LeadProduct[];
  onEdit: (product: LeadProduct) => void;
  onDelete: (id: string) => void;
  onReorder: (products: { id: string; display_order: number }[]) => void;
  isDeleting?: boolean;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onReorder,
  isDeleting,
}: ProductsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...products];
    [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
    const reorderData = newProducts.map((p, i) => ({ id: p.id, display_order: i + 1 }));
    onReorder(reorderData);
  };

  const handleMoveDown = (index: number) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    const reorderData = newProducts.map((p, i) => ({ id: p.id, display_order: i + 1 }));
    onReorder(reorderData);
  };

  const getBadgeVariant = (badge: string | null) => {
    if (!badge) return 'secondary';
    if (badge === 'MOST POPULAR') return 'default';
    if (badge === 'Premium Lead') return 'secondary';
    if (badge === 'High-Intent Lead') return 'outline';
    if (badge === 'Value Lead') return 'outline';
    return 'secondary';
  };

  const formatPrice = (product: LeadProduct) => {
    if (product.standing_order_price) {
      return `$${product.base_price} / $${product.standing_order_price}`;
    }
    return `$${product.base_price}`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Min Qty</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === products.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.category?.replace('-', ' ') || 'General'}
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(product)}</TableCell>
                <TableCell>{product.min_order_quantity}</TableCell>
                <TableCell>
                  {product.conversion_rate ? `${product.conversion_rate}%` : '-'}
                </TableCell>
                <TableCell>
                  {product.badge ? (
                    <Badge variant={getBadgeVariant(product.badge)} className="text-xs">
                      {product.badge}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
