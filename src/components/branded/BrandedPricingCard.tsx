import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageLeadProduct } from '@/hooks/useCompanyPage';

interface BrandedPricingCardProps {
  pageProduct: PageLeadProduct;
  branding: {
    primary_color: string;
    accent_color: string;
    cta_color: string;
  };
  index?: number;
  onOrder?: (product: PageLeadProduct) => void;
}

export function BrandedPricingCard({ pageProduct, branding, index = 0, onOrder }: BrandedPricingCardProps) {
  const { lead_product: product, custom_price } = pageProduct;
  const displayPrice = custom_price ?? product.base_price;
  const isPopular = product.badge === 'MOST POPULAR';
  const hasStandingOrder = product.standing_order_price !== null;

  return (
    <div
      className={cn(
        'group relative opacity-0 animate-card-enter',
        index === 0 && 'stagger-1',
        index === 1 && 'stagger-2',
        index === 2 && 'stagger-3',
        index === 3 && 'stagger-4',
        index === 4 && 'stagger-5',
        index === 5 && 'stagger-6'
      )}
    >
      {/* Gradient border wrapper */}
      <div
        className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
        }}
      />
      
      {/* Main card */}
      <div
        className={cn(
          'relative rounded-2xl p-4 md:p-5 transition-all duration-500 ease-out',
          'card-3d-shadow hover:card-3d-shadow-hover',
          'transform hover:-translate-y-2 hover:scale-[1.02]'
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: isPopular 
            ? `0 0 0 2px ${branding.accent_color}, 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 20px 25px -5px rgba(0, 0, 0, 0.05)`
            : undefined,
        }}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute top-0 left-4 right-4 h-1 rounded-b-full"
          style={{
            background: `linear-gradient(to right, ${branding.primary_color}, ${branding.accent_color})`,
          }}
        />

        {/* Popular badge with floating animation */}
        {product.badge && (
          <div
            className={cn(
              'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg',
              isPopular && 'animate-float'
            )}
            style={{
              background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
              boxShadow: `0 4px 14px ${branding.accent_color}40`,
            }}
          >
            <span className="flex items-center gap-1">
              {isPopular && <Sparkles className="h-3 w-3" />}
              {product.badge}
            </span>
          </div>
        )}

        {/* Header */}
        <div className={cn('pt-2', product.badge && 'pt-4')}>
          <h3 className="font-bold text-base md:text-lg text-foreground leading-tight">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-4 mb-3">
          {hasStandingOrder ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-bold text-foreground">${displayPrice}</span>
                <span className="text-xs text-muted-foreground">/ lead</span>
              </div>
              <div 
                className="flex items-baseline gap-1.5"
                style={{ color: branding.accent_color }}
              >
                <span className="text-lg md:text-xl font-bold">${product.standing_order_price}</span>
                <span className="text-xs">/ standing</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Min {product.standing_order_min_weeks}wk, {product.standing_order_min_quantity} leads
              </p>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold text-foreground">${displayPrice}</span>
              <span className="text-xs text-muted-foreground">/ lead</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Min. {product.min_order_quantity} leads
          </p>
        </div>

        {/* Conversion rate highlight */}
        {product.conversion_rate && (
          <div
            className="mb-3 p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-[1.02]"
            style={{
              backgroundColor: `${branding.accent_color}08`,
              borderColor: `${branding.accent_color}20`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Conversion</span>
              <span 
                className="text-lg font-bold"
                style={{ color: branding.accent_color }}
              >
                {product.conversion_rate}%
              </span>
            </div>
          </div>
        )}

        {/* Features list - compact */}
        <ul className="space-y-1.5 mb-4">
          {product.features?.slice(0, 4).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <div
                className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${branding.accent_color}15` }}
              >
                <Check
                  className="h-2.5 w-2.5"
                  style={{ color: branding.accent_color }}
                />
              </div>
              <span className="text-muted-foreground leading-tight">{feature}</span>
            </li>
          ))}
          {product.features && product.features.length > 4 && (
            <li className="text-xs text-muted-foreground pl-6">
              +{product.features.length - 4} more
            </li>
          )}
        </ul>

        {/* CTA Button with glow effect */}
        <Button
          className={cn(
            'w-full text-white font-semibold rounded-xl h-11 text-sm',
            'transition-all duration-300',
            'hover:shadow-lg hover:scale-[1.02]',
            'active:scale-[0.98]'
          )}
          style={{
            backgroundColor: branding.cta_color,
            boxShadow: `0 4px 14px ${branding.cta_color}30`,
          }}
          onClick={() => onOrder?.(pageProduct)}
        >
          {product.cta_label}
        </Button>
      </div>
    </div>
  );
}
