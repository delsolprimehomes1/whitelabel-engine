import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PricingCard } from './PricingCard';
import { useActiveLeadProducts, LeadProduct } from '@/hooks/useLeadProducts';

const CATEGORIES = [
  { value: 'all', label: 'All Leads' },
  { value: 'verified-life', label: 'Verified Life' },
  { value: 'annuity', label: 'Annuity' },
  { value: 'iul', label: 'IUL' },
  { value: 'ethos', label: 'Ethos' },
  { value: 'final-expense', label: 'Final Expense' },
  { value: 'inbound-calls', label: 'Inbound Calls' },
];

interface PricingGridProps {
  onOrder?: (product: LeadProduct) => void;
}

export function PricingGrid({ onOrder }: PricingGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: products, isLoading } = useActiveLeadProducts();

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products?.filter((p) => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-1 h-auto p-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <PricingCard key={product.id} product={product} onOrder={onOrder} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No products available in this category.</p>
        </div>
      )}
    </div>
  );
}
