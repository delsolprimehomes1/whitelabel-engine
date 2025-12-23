import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadProduct, LeadProductInsert } from '@/hooks/useLeadProducts';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  base_price: z.coerce.number().min(0, 'Price must be positive'),
  conversion_rate: z.coerce.number().min(0).max(100).optional(),
  min_order_quantity: z.coerce.number().min(1, 'Minimum quantity is 1'),
  features: z.string().optional(),
  badge: z.string().max(50).optional(),
  cta_label: z.string().min(1, 'CTA label is required').max(50),
  display_order: z.coerce.number().min(0),
  is_active: z.boolean(),
  category: z.string().optional(),
  standing_order_price: z.coerce.number().min(0).optional().or(z.literal('')),
  standing_order_min_weeks: z.coerce.number().min(1).optional().or(z.literal('')),
  standing_order_min_quantity: z.coerce.number().min(1).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = [
  { value: 'verified-life', label: 'Verified Life' },
  { value: 'annuity', label: 'Annuity' },
  { value: 'iul', label: 'IUL' },
  { value: 'ethos', label: 'Ethos' },
  { value: 'internet', label: 'Internet' },
  { value: 'final-expense', label: 'Final Expense' },
  { value: 'inbound-calls', label: 'Inbound Calls' },
  { value: 'general', label: 'General' },
];

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Premium Lead', label: 'Premium Lead' },
  { value: 'MOST POPULAR', label: 'MOST POPULAR' },
  { value: 'High-Intent Lead', label: 'High-Intent Lead' },
  { value: 'Value Lead', label: 'Value Lead' },
];

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: LeadProduct | null;
  onSubmit: (data: LeadProductInsert) => void;
  isLoading?: boolean;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: ProductFormDialogProps) {
  const isEditing = !!product;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      base_price: 0,
      conversion_rate: undefined,
      min_order_quantity: 1,
      features: '',
      badge: '',
      cta_label: 'Order Leads',
      display_order: 0,
      is_active: true,
      category: 'general',
      standing_order_price: '',
      standing_order_min_weeks: '',
      standing_order_min_quantity: '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        base_price: product.base_price,
        conversion_rate: product.conversion_rate || undefined,
        min_order_quantity: product.min_order_quantity,
        features: product.features?.join('\n') || '',
        badge: product.badge || '',
        cta_label: product.cta_label,
        display_order: product.display_order,
        is_active: product.is_active,
        category: product.category || 'general',
        standing_order_price: product.standing_order_price || '',
        standing_order_min_weeks: product.standing_order_min_weeks || '',
        standing_order_min_quantity: product.standing_order_min_quantity || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        base_price: 0,
        conversion_rate: undefined,
        min_order_quantity: 1,
        features: '',
        badge: '',
        cta_label: 'Order Leads',
        display_order: 0,
        is_active: true,
        category: 'general',
        standing_order_price: '',
        standing_order_min_weeks: '',
        standing_order_min_quantity: '',
      });
    }
  }, [product, form]);

  const handleSubmit = (values: FormValues) => {
    const features = values.features
      ? values.features.split('\n').filter((f) => f.trim())
      : [];

    const data: LeadProductInsert = {
      name: values.name,
      description: values.description || null,
      base_price: values.base_price,
      conversion_rate: values.conversion_rate || null,
      min_order_quantity: values.min_order_quantity,
      features: features.length > 0 ? features : null,
      badge: values.badge || null,
      cta_label: values.cta_label,
      display_order: values.display_order,
      is_active: values.is_active,
      category: values.category || null,
      standing_order_price: values.standing_order_price === '' ? null : Number(values.standing_order_price),
      standing_order_min_weeks: values.standing_order_min_weeks === '' ? null : Number(values.standing_order_min_weeks),
      standing_order_min_quantity: values.standing_order_min_quantity === '' ? null : Number(values.standing_order_min_quantity),
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead Product' : 'Add Lead Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the lead product details below.' : 'Fill in the details for the new lead product.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Verified General Life Leads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the lead product..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_order_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Order Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conversion_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conversion Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select badge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BADGE_OPTIONS.map((badge) => (
                          <SelectItem key={badge.value || 'none'} value={badge.value || 'none'}>
                            {badge.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cta_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Button Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Order Leads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <FormDescription>Show this product publicly</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Verified & Exclusive
Pre-Qualified Interest
Higher Close Rate"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter each feature on a new line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-4">Standing Order Options (for Internet Leads)</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="standing_order_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standing Order Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Leave empty if N/A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="standing_order_min_weeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Weeks</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="standing_order_min_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
