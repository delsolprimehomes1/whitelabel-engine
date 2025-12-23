import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LeadProduct } from '@/hooks/useLeadProducts';

interface PricingCardProps {
  product: LeadProduct;
  onOrder?: (product: LeadProduct) => void;
}

export function PricingCard({ product, onOrder }: PricingCardProps) {
  const isPopular = product.badge === 'MOST POPULAR';
  const hasStandingOrder = product.standing_order_price !== null;

  const getBadgeClass = (badge: string | null) => {
    if (!badge) return '';
    if (badge === 'MOST POPULAR') return 'gradient-popular text-white border-0';
    if (badge === 'Premium Lead') return 'gradient-premium text-white border-0';
    if (badge === 'High-Intent Lead') return 'gradient-intent text-white border-0';
    if (badge === 'Value Lead') return 'gradient-value text-white border-0';
    return '';
  };

  const getCategoryGradient = (category: string | null) => {
    switch (category) {
      case 'verified-life':
        return 'from-primary to-primary/70';
      case 'annuity':
        return 'from-badge-premium to-primary';
      case 'iul':
        return 'from-badge-premium to-badge-intent';
      case 'ethos':
        return 'from-badge-intent to-primary';
      case 'internet':
        return 'from-muted-foreground to-muted-foreground/70';
      case 'final-expense':
        return 'from-accent to-accent/70';
      case 'inbound-calls':
        return 'from-badge-value to-badge-value/70';
      default:
        return 'from-primary to-primary/70';
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        isPopular && 'ring-2 ring-accent shadow-lg'
      )}
    >
      {/* Gradient top border */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
          getCategoryGradient(product.category)
        )}
      />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          {product.badge && (
            <Badge className={cn('shrink-0 text-xs', getBadgeClass(product.badge))}>
              {product.badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="mb-4">
          {hasStandingOrder ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${product.base_price}</span>
                <span className="text-muted-foreground text-sm">/ lead (one-time)</span>
              </div>
              <div className="flex items-baseline gap-2 text-accent">
                <span className="text-2xl font-bold">${product.standing_order_price}</span>
                <span className="text-sm">/ lead (standing order)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Standing order: Min {product.standing_order_min_weeks} weeks, {product.standing_order_min_quantity} leads
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.base_price}</span>
              <span className="text-muted-foreground text-sm">/ lead</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-2">
            Min. order: {product.min_order_quantity} leads
          </p>
        </div>

        {product.conversion_rate && (
          <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-lg font-bold text-accent">{product.conversion_rate}%</span>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {product.features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          onClick={() => onOrder?.(product)}
        >
          {product.cta_label}
        </Button>
      </CardFooter>
    </Card>
  );
}
