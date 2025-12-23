import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, DollarSign } from 'lucide-react';
import { useLeadProducts, LeadProduct } from '@/hooks/useLeadProducts';
import { useCompanyPageLeads, useUpsertPageLeads } from '@/hooks/usePageLeads';
import { CompanyWithBranding } from '@/hooks/useCompanies';

interface PageLeadItem {
  lead_product_id: string;
  product: LeadProduct;
  is_visible: boolean;
  custom_price: number | null;
  display_order: number;
}

interface PageLeadsDialogProps {
  company: CompanyWithBranding | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageLeadsDialog({ company, open, onOpenChange }: PageLeadsDialogProps) {
  const { data: allProducts } = useLeadProducts();
  const { data: existingPageLeads } = useCompanyPageLeads(company?.id);
  const upsertPageLeads = useUpsertPageLeads();

  const [pageLeadItems, setPageLeadItems] = useState<PageLeadItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Build the page leads list when data is available
  useEffect(() => {
    if (!allProducts) return;

    const existingMap = new Map(
      existingPageLeads?.map((pl) => [pl.lead_product_id, pl]) ?? []
    );

    // If there are existing page leads, use their order; otherwise use product order
    const items: PageLeadItem[] = allProducts.map((product) => {
      const existing = existingMap.get(product.id);
      return {
        lead_product_id: product.id,
        product,
        is_visible: existing?.is_visible ?? false,
        custom_price: existing?.custom_price ?? null,
        display_order: existing?.display_order ?? product.display_order,
      };
    });

    // Sort: visible items first (by display_order), then non-visible items
    items.sort((a, b) => {
      if (a.is_visible && !b.is_visible) return -1;
      if (!a.is_visible && b.is_visible) return 1;
      return a.display_order - b.display_order;
    });

    setPageLeadItems(items);
  }, [allProducts, existingPageLeads]);

  const handleVisibilityChange = (productId: string, isVisible: boolean) => {
    setPageLeadItems((items) =>
      items.map((item) =>
        item.lead_product_id === productId ? { ...item, is_visible: isVisible } : item
      )
    );
  };

  const handleCustomPriceChange = (productId: string, price: string) => {
    const numPrice = price === '' ? null : parseFloat(price);
    setPageLeadItems((items) =>
      items.map((item) =>
        item.lead_product_id === productId
          ? { ...item, custom_price: isNaN(numPrice as number) ? null : numPrice }
          : item
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setPageLeadItems((items) => {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);
      return newItems;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    if (!company) return;

    // Only save visible items with their new display_order
    const visibleItems = pageLeadItems
      .filter((item) => item.is_visible)
      .map((item, index) => ({
        lead_product_id: item.lead_product_id,
        custom_price: item.custom_price,
        display_order: index,
        is_visible: true,
      }));

    await upsertPageLeads.mutateAsync({
      companyId: company.id,
      pageLeads: visibleItems,
    });

    onOpenChange(false);
  };

  const visibleCount = pageLeadItems.filter((item) => item.is_visible).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Page Leads</DialogTitle>
          <DialogDescription>
            Configure which lead products appear on {company?.name}'s pricing page. Drag to reorder,
            toggle visibility, and set custom pricing overrides.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-2">
            {pageLeadItems.map((item, index) => (
              <div
                key={item.lead_product_id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  item.is_visible
                    ? 'bg-card border-border'
                    : 'bg-muted/30 border-transparent opacity-60'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Switch
                    checked={item.is_visible}
                    onCheckedChange={(checked) =>
                      handleVisibilityChange(item.lead_product_id, checked)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Base: ${item.product.base_price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Label htmlFor={`price-${item.lead_product_id}`} className="sr-only">
                    Custom Price
                  </Label>
                  <div className="relative w-28">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`price-${item.lead_product_id}`}
                      type="number"
                      step="0.01"
                      placeholder={item.product.base_price.toString()}
                      value={item.custom_price ?? ''}
                      onChange={(e) =>
                        handleCustomPriceChange(item.lead_product_id, e.target.value)
                      }
                      className="pl-7 h-9"
                      disabled={!item.is_visible}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {visibleCount} product{visibleCount !== 1 ? 's' : ''} will be displayed
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={upsertPageLeads.isPending}>
                {upsertPageLeads.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
