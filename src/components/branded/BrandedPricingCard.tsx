import { useState } from 'react';
import { Check, Sparkles, Minus, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageLeadProduct } from '@/hooks/useCompanyPage';

interface BrandedPricingCardProps {
  pageProduct: PageLeadProduct;
  branding: {
    primary_color: string;
    accent_color: string;
    cta_color: string;
    dark_mode?: boolean;
  };
  index?: number;
  onOrder?: (product: PageLeadProduct, quantity: number) => void;
}

export function BrandedPricingCard({ pageProduct, branding, index = 0, onOrder }: BrandedPricingCardProps) {
  const { lead_product: product, custom_price } = pageProduct;
  const displayPrice = custom_price ?? product.base_price;
  const isPopular = product.badge === 'MOST POPULAR';
  const hasStandingOrder = product.standing_order_price !== null;
  const minQuantity = product.min_order_quantity || 1;
  const isDark = branding.dark_mode;

  const [quantity, setQuantity] = useState(minQuantity);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const totalPrice = (displayPrice * quantity).toFixed(2);
  const visibleFeatures = showAllFeatures ? product.features : product.features?.slice(0, 3);
  const hasMoreFeatures = (product.features?.length || 0) > 3;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(minQuantity, prev - 1));
  };

  return (
    <div
      className={cn(
        'group relative opacity-0 animate-card-enter h-full',
        index === 0 && 'stagger-1',
        index === 1 && 'stagger-2',
        index === 2 && 'stagger-3',
        index === 3 && 'stagger-4',
        index === 4 && 'stagger-5',
        index === 5 && 'stagger-6'
      )}
      style={{
        '--primary-color': branding.primary_color,
        '--accent-color': branding.accent_color,
      } as React.CSSProperties}
    >
      {/* Animated gradient border on hover - behind card */}
      <div
        className="absolute -inset-[2px] rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"
        style={{
          background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color}, ${branding.primary_color})`,
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s linear infinite',
        }}
      />
      
      {/* Main card - always on top with refined glassmorphism */}
      <div
        className={cn(
          'relative z-10 rounded-3xl p-3 md:p-4 transition-all duration-500 ease-out h-full flex flex-col',
          'card-3d-enhanced tilt-3d-hover',
          isDark ? 'glass-dark-enhanced inner-glow-dark' : 'glass-enhanced inner-glow'
        )}
        style={{
          background: isDark 
            ? 'rgba(13, 13, 13, 0.95)'
            : undefined,
          boxShadow: isPopular 
            ? `0 0 0 2px ${branding.accent_color}, 0 8px 32px -8px rgba(0, 0, 0, 0.25), 0 0 20px ${branding.accent_color}30`
            : isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)'
              : undefined,
        }}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-1 rounded-b-full"
          style={{
            background: `linear-gradient(to right, ${branding.primary_color}, ${branding.accent_color})`,
          }}
        />

        {/* Popular badge with floating animation */}
        {product.badge && (
          <div
            className={cn(
              'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white shadow-lg',
              isPopular && 'animate-soft-bounce'
            )}
            style={{
              background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
              boxShadow: `0 4px 20px ${branding.accent_color}50`,
            }}
          >
            <span className="flex items-center gap-1">
              {isPopular && <Sparkles className="h-3 w-3" />}
              {product.badge}
            </span>
          </div>
        )}

        {/* Header - Compact */}
        <div className={cn('pt-1', product.badge && 'pt-3')}>
          <h3 
            className="font-bold text-sm md:text-base leading-tight"
            style={{ color: isDark ? '#FFFFFF' : 'hsl(222 47% 11%)' }}
          >
            {product.name}
          </h3>
          <p 
            className="text-[11px] md:text-xs mt-0.5 line-clamp-2"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'hsl(0 0% 50%)' }}
          >
            {product.description}
          </p>
        </div>

        {/* Pricing - Inline compact layout */}
        <div className="mt-3 mb-2.5">
          {hasStandingOrder ? (
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-xl md:text-2xl font-bold"
                    style={{ color: isDark ? '#FFFFFF' : 'hsl(222 47% 11%)' }}
                  >
                    ${displayPrice}
                  </span>
                  <span 
                    className="text-[10px]"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'hsl(0 0% 50%)' }}
                  >
                    /lead
                  </span>
                </div>
              </div>
              <div 
                className="text-right px-2 py-1 rounded-lg"
                style={{ backgroundColor: `${branding.accent_color}15` }}
              >
                <div 
                  className="text-sm md:text-base font-bold"
                  style={{ color: branding.accent_color }}
                >
                  ${product.standing_order_price}
                </div>
                <div 
                  className="text-[9px]"
                  style={{ color: branding.accent_color }}
                >
                  standing · {product.standing_order_min_weeks}wk
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span 
                className="text-xl md:text-2xl font-bold"
                style={{ color: isDark ? '#FFFFFF' : 'hsl(222 47% 11%)' }}
              >
                ${displayPrice}
              </span>
              <span 
                className="text-[10px]"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'hsl(0 0% 50%)' }}
              >
                /lead
              </span>
            </div>
          )}
        </div>

        {/* Quantity Selector - Compact touch-friendly */}
        <div 
          className="mb-2.5 p-2.5 rounded-2xl border transition-all duration-300"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= minQuantity}
                className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 touch-target',
                  'active:scale-90',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                }}
              >
                <Minus className="h-3.5 w-3.5" style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'hsl(0 0% 40%)' }} />
              </button>
              <span 
                className="text-base font-bold w-8 text-center tabular-nums"
                style={{ color: isDark ? '#FFFFFF' : 'hsl(222 47% 11%)' }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 touch-target',
                  'active:scale-90'
                )}
                style={{
                  backgroundColor: `${branding.primary_color}15`,
                  border: `1px solid ${branding.primary_color}30`,
                }}
              >
                <Plus className="h-3.5 w-3.5" style={{ color: branding.primary_color }} />
              </button>
            </div>
            <div className="text-right">
              <div 
                className="text-base md:text-lg font-bold"
                style={{ color: branding.accent_color }}
              >
                ${totalPrice}
              </div>
              <div 
                className="text-[9px] -mt-0.5"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'hsl(0 0% 55%)' }}
              >
                total · min {minQuantity}
              </div>
            </div>
          </div>
        </div>

        {/* Conversion rate highlight - Compact */}
        {product.conversion_rate && (
          <div
            className="mb-2.5 px-3 py-2 rounded-xl border transition-all duration-300 group-hover:scale-[1.01]"
            style={{
              backgroundColor: `${branding.accent_color}08`,
              borderColor: `${branding.accent_color}20`,
            }}
          >
            <div className="flex items-center justify-between">
              <span 
                className="text-[10px] font-medium"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'hsl(0 0% 50%)' }}
              >
                Conversion Rate
              </span>
              <span 
                className="text-base font-bold"
                style={{ color: branding.accent_color }}
              >
                {product.conversion_rate}%
              </span>
            </div>
          </div>
        )}

        {/* Features list - Collapsible compact */}
        <div className="flex-grow">
          <ul className="space-y-1 mb-2.5">
            {visibleFeatures?.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                <div
                  className="mt-0.5 h-3.5 w-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${branding.accent_color}15` }}
                >
                  <Check
                    className="h-2 w-2"
                    style={{ color: branding.accent_color }}
                  />
                </div>
                <span 
                  className="leading-tight"
                  style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'hsl(0 0% 45%)' }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          {hasMoreFeatures && (
            <button
              type="button"
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="flex items-center gap-1 text-[10px] font-medium transition-colors"
              style={{ color: branding.primary_color }}
            >
              <ChevronDown 
                className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  showAllFeatures && 'rotate-180'
                )} 
              />
              {showAllFeatures ? 'Show less' : `+${(product.features?.length || 0) - 3} more`}
            </button>
          )}
        </div>

        {/* CTA Button with glow effect */}
        <Button
          className={cn(
            'w-full text-white font-semibold rounded-2xl h-11 text-sm mt-auto',
            'transition-all duration-300',
            'hover:scale-[1.02] hover:shadow-xl',
            'active:scale-[0.98]',
            'cta-glow-pulse touch-target'
          )}
          style={{
            background: `linear-gradient(135deg, ${branding.cta_color}, ${branding.accent_color})`,
            boxShadow: `0 4px 20px ${branding.cta_color}40`,
          }}
          onClick={() => onOrder?.(pageProduct, quantity)}
        >
          {product.cta_label} · ${totalPrice}
        </Button>
      </div>
    </div>
  );
}