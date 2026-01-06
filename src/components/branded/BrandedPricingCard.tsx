import { useState } from 'react';
import { Check, Minus, Plus, Sparkles } from 'lucide-react';
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
  const visibleFeatures = showAllFeatures ? product.features : product.features?.slice(0, 4);
  const hasMoreFeatures = (product.features?.length || 0) > 4;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(minQuantity, prev - 1));

  return (
    <div
      className={cn(
        'group relative h-full opacity-0',
        'animate-[fade-in-up_0.6s_ease-out_forwards]',
        index === 0 && 'animation-delay-100',
        index === 1 && 'animation-delay-200',
        index === 2 && 'animation-delay-300',
        index === 3 && 'animation-delay-400',
        index === 4 && 'animation-delay-500',
        index === 5 && 'animation-delay-600'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Popular indicator - top glow */}
      {isPopular && (
        <div 
          className="absolute -inset-px rounded-[28px] opacity-60 blur-sm -z-10"
          style={{ background: `linear-gradient(135deg, ${branding.accent_color}, ${branding.cta_color})` }}
        />
      )}

      {/* Card container */}
      <div
        className={cn(
          'relative h-full rounded-[24px] overflow-hidden',
          'transition-all duration-500 ease-out',
          'hover:-translate-y-1',
          isPopular && 'ring-2',
        )}
        style={{
          background: isDark 
            ? 'linear-gradient(180deg, rgba(26, 26, 26, 0.98) 0%, rgba(13, 13, 13, 0.98) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.98) 100%)',
          boxShadow: isDark
            ? '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -12px rgba(0,0,0,0.4)'
            : '0 1px 0 0 rgba(255,255,255,0.8) inset, 0 24px 48px -12px rgba(0,0,0,0.12)',
          borderColor: isPopular ? branding.accent_color : undefined,
          border: isPopular ? undefined : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Popular badge */}
        {product.badge && (
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div
              className={cn(
                'px-4 py-1.5 rounded-b-xl text-[11px] font-semibold tracking-wide uppercase',
                'flex items-center gap-1.5 text-white'
              )}
              style={{
                background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
              }}
            >
              {isPopular && <Sparkles className="h-3 w-3" />}
              {product.badge}
            </div>
          </div>
        )}

        {/* Card content */}
        <div className={cn('p-5 md:p-6 flex flex-col h-full', product.badge && 'pt-10')}>
          
          {/* Header */}
          <div className="mb-5">
            <h3 
              className="text-lg md:text-xl font-semibold tracking-tight"
              style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
            >
              {product.name}
            </h3>
            {product.description && (
              <p 
                className="mt-1.5 text-[13px] leading-relaxed line-clamp-2"
                style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)' }}
              >
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing section */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span 
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
              >
                ${displayPrice}
              </span>
              <span 
                className="text-sm font-medium ml-0.5"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                /lead
              </span>
            </div>

            {/* Standing order option */}
            {hasStandingOrder && (
              <div 
                className="mt-3 p-3 rounded-xl"
                style={{ 
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                  >
                    Standing Order
                  </span>
                  <span 
                    className="text-base font-bold"
                    style={{ color: branding.accent_color }}
                  >
                    ${product.standing_order_price}/lead
                  </span>
                </div>
                <p 
                  className="text-[11px] mt-1"
                  style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}
                >
                  Min {product.standing_order_min_quantity} leads · {product.standing_order_min_weeks} week commitment
                </p>
              </div>
            )}
          </div>

          {/* Conversion rate badge */}
          {product.conversion_rate && (
            <div 
              className="mb-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg self-start"
              style={{ 
                background: `${branding.accent_color}12`,
                border: `1px solid ${branding.accent_color}25`,
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: branding.accent_color }}
              />
              <span 
                className="text-xs font-semibold"
                style={{ color: branding.accent_color }}
              >
                {product.conversion_rate}% conversion rate
              </span>
            </div>
          )}

          {/* Quantity selector */}
          <div 
            className="mb-5 p-3 rounded-xl"
            style={{ 
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= minQuantity}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    'transition-all duration-200 active:scale-95',
                    'disabled:opacity-30 disabled:cursor-not-allowed'
                  )}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  }}
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <span 
                  className="w-12 text-center text-lg font-semibold tabular-nums"
                  style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
                >
                  {quantity}
                </span>
                
                <button
                  type="button"
                  onClick={handleIncrement}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    'transition-all duration-200 active:scale-95'
                  )}
                  style={{
                    background: `${branding.primary_color}15`,
                    color: branding.primary_color,
                  }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="text-right">
                <div 
                  className="text-xl font-bold"
                  style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
                >
                  ${totalPrice}
                </div>
                <div 
                  className="text-[11px]"
                  style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}
                >
                  min {minQuantity} leads
                </div>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="flex-grow mb-5">
            <ul className="space-y-2.5">
              {visibleFeatures?.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div
                    className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${branding.accent_color}18` }}
                  >
                    <Check
                      className="h-2.5 w-2.5"
                      style={{ color: branding.accent_color }}
                      strokeWidth={3}
                    />
                  </div>
                  <span 
                    className="text-[13px] leading-snug"
                    style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}
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
                className="mt-3 text-[12px] font-medium transition-colors"
                style={{ color: branding.primary_color }}
              >
                {showAllFeatures ? 'Show less' : `+ ${(product.features?.length || 0) - 4} more features`}
              </button>
            )}
          </div>

          {/* CTA Button */}
          <Button
            className={cn(
              'w-full h-12 text-[14px] font-semibold rounded-xl',
              'transition-all duration-300',
              'hover:scale-[1.02] hover:shadow-lg',
              'active:scale-[0.98]'
            )}
            style={{
              background: isPopular 
                ? `linear-gradient(135deg, ${branding.cta_color}, ${branding.accent_color})`
                : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              color: isPopular ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#0A0A0A'),
              boxShadow: isPopular ? `0 8px 24px -8px ${branding.cta_color}60` : undefined,
              border: isPopular ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            }}
            onClick={() => onOrder?.(pageProduct, quantity)}
          >
            {product.cta_label}
          </Button>
        </div>
      </div>
    </div>
  );
}
