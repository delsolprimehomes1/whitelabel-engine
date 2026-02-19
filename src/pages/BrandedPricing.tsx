import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyBySlug, usePageLeads } from '@/hooks/useCompanyPage';
import { BrandedPricingCard } from '@/components/branded/BrandedPricingCard';
import { useActiveLeadProducts } from '@/hooks/useLeadProducts';
import { WhyChooseSection } from '@/components/branded/WhyChooseSection';
import { HowItWorksSection } from '@/components/branded/HowItWorksSection';
import { WhatMakesSpecialSection } from '@/components/branded/WhatMakesSpecialSection';

export default function BrandedPricing() {
  const { slug } = useParams<{ slug: string }>();
  const { data: company, isLoading: companyLoading, error: companyError } = useCompanyBySlug(slug);
  const { data: pageLeads, isLoading: leadsLoading } = usePageLeads(company?.id);
  const { data: allProducts } = useActiveLeadProducts();

  const isLoading = companyLoading || leadsLoading;

  const defaultBranding = {
    primary_color: '#6366F1',
    accent_color: '#8B5CF6',
    cta_color: '#A855F7',
    logo_url: null,
    font_family: null,
    dark_mode: true,
  };

  const branding = company?.branding ?? defaultBranding;
  const isDark = branding.dark_mode;

  const displayProducts = pageLeads && pageLeads.length > 0 
    ? pageLeads 
    : allProducts?.map((p) => ({
        id: p.id,
        custom_price: null,
        display_order: p.display_order,
        lead_product: p,
      })) ?? [];

  if (companyError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: isDark ? '#000000' : '#FFFFFF' }}
      >
        <div className="text-center">
          <h1 
            className="text-xl font-semibold mb-2"
            style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
          >
            Page Not Found
          </h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            The pricing page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: isDark ? '#000000' : '#FAFAFA' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-32 mx-auto mb-4 rounded-xl" />
            <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[480px] rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: isDark ? '#000000' : '#FFFFFF' }}
      >
        <div className="text-center">
          <h1 
            className="text-xl font-semibold mb-2"
            style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
          >
            Page Not Found
          </h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            The pricing page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleOrder = (product: typeof displayProducts[0], quantity: number) => {
    console.log('Order:', product, 'Quantity:', quantity);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        fontFamily: branding.font_family || 'system-ui, -apple-system, sans-serif',
        background: isDark 
          ? 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      }}
    >
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[300px] -right-[200px] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px]"
          style={{ background: branding.primary_color }}
        />
        <div 
          className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: branding.accent_color }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark 
            ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          {branding.logo_url && (
            <img
              src={branding.logo_url}
              alt={`${company.name} logo`}
              className="h-10 md:h-12 mx-auto mb-6 object-contain"
            />
          )}
          
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
          >
            {company.name}
          </h1>
          
          <p
            className="text-base md:text-lg max-w-md mx-auto"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
          >
            Choose the perfect lead package for your business
          </p>
        </div>

        {/* Pricing Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
            {displayProducts.map((pageProduct, index) => (
              <BrandedPricingCard
                key={pageProduct.id}
                pageProduct={pageProduct}
                branding={branding}
                index={index}
                onOrder={handleOrder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
              No products available at this time.
            </p>
          </div>
        )}

        {/* New content sections */}
        <WhatMakesSpecialSection companyName={company.name} branding={branding} />
        <WhyChooseSection companyName={company.name} branding={branding} />
        <HowItWorksSection branding={branding} />

        {/* Footer */}
        <div className="mt-12 md:mt-16 text-center">
          <p
            className="text-xs"
            style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}
          >
            Secure checkout powered by Stripe • All transactions encrypted
          </p>
          
          {company.contact_email && (
            <p
              className="text-xs mt-2"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}
            >
              Questions?{' '}
              <a
                href={`mailto:${company.contact_email}`}
                className="underline transition-colors"
                style={{ color: branding.primary_color }}
              >
                {company.contact_email}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
