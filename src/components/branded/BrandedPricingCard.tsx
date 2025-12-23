import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PageLeadProduct } from '@/hooks/useCompanyPage';

interface BrandedPricingCardProps {
  pageProduct: PageLeadProduct;
  branding: {
    primary_color: string;
    accent_color: string;
    cta_color: string;
  };
  onOrder?: (product: PageLeadProduct) => void;
}

export function BrandedPricingCard({ pageProduct, branding, onOrder }: BrandedPricingCardProps) {
  const { lead_product: product, custom_price } = pageProduct;
  const displayPrice = custom_price ?? product.base_price;
  const isPopular = product.badge === 'MOST POPULAR';
  const hasStandingOrder = product.standing_order_price !== null;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        isPopular && 'shadow-lg'
      )}
      style={{
        borderColor: isPopular ? branding.accent_color : undefined,
        boxShadow: isPopular ? `0 4px 20px ${branding.accent_color}30` : undefined,
      }}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(to right, ${branding.primary_color}, ${branding.accent_color})`,
        }}
      />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          {product.badge && (
            <Badge
              className="shrink-0 text-xs border-0 text-white"
              style={{
                background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
              }}
            >
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
                <span className="text-3xl font-bold">${displayPrice}</span>
                <span className="text-muted-foreground text-sm">/ lead (one-time)</span>
              </div>
              <div className="flex items-baseline gap-2" style={{ color: branding.accent_color }}>
                <span className="text-2xl font-bold">${product.standing_order_price}</span>
                <span className="text-sm">/ lead (standing order)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Standing order: Min {product.standing_order_min_weeks} weeks, {product.standing_order_min_quantity} leads
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${displayPrice}</span>
              <span className="text-muted-foreground text-sm">/ lead</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-2">
            Min. order: {product.min_order_quantity} leads
          </p>
        </div>

        {product.conversion_rate && (
          <div
            className="mb-4 p-3 rounded-lg border"
            style={{
              backgroundColor: `${branding.accent_color}10`,
              borderColor: `${branding.accent_color}30`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-lg font-bold" style={{ color: branding.accent_color }}>
                {product.conversion_rate}%
              </span>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {product.features?.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check
                className="h-4 w-4 shrink-0 mt-0.5"
                style={{ color: branding.accent_color }}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full text-white border-0"
          style={{
            backgroundColor: branding.cta_color,
          }}
          onClick={() => onOrder?.(pageProduct)}
        >
          {product.cta_label}
        </Button>
      </CardFooter>
    </Card>
  );
}
