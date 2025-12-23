import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyBySlug, usePageLeads } from '@/hooks/useCompanyPage';
import { BrandedPricingCard } from '@/components/branded/BrandedPricingCard';
import { useActiveLeadProducts } from '@/hooks/useLeadProducts';

export default function BrandedPricing() {
  const { slug } = useParams<{ slug: string }>();
  const { data: company, isLoading: companyLoading, error: companyError } = useCompanyBySlug(slug);
  const { data: pageLeads, isLoading: leadsLoading } = usePageLeads(company?.id);
  const { data: allProducts } = useActiveLeadProducts();

  const isLoading = companyLoading || leadsLoading;

  // Default branding if no custom branding set
  const defaultBranding = {
    primary_color: '#3B82F6',
    accent_color: '#10B981',
    cta_color: '#8B5CF6',
    logo_url: null,
    font_family: null,
    dark_mode: false,
  };

  const branding = company?.branding ?? defaultBranding;

  // Use page_leads if any exist, otherwise fall back to all active products
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Company Not Found</h1>
          <p className="text-sm text-muted-foreground">The pricing page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: branding.dark_mode
            ? 'linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 10%) 100%)'
            : 'linear-gradient(180deg, hsl(220 20% 97%) 0%, hsl(220 20% 100%) 100%)',
        }}
      >
        <div className="px-3 py-6 md:px-4 md:py-8 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <Skeleton className="h-10 w-32 mx-auto mb-3 rounded-xl" />
            <Skeleton className="h-6 w-48 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Company Not Found</h1>
          <p className="text-sm text-muted-foreground">The pricing page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleOrder = (product: typeof displayProducts[0], quantity: number) => {
    // TODO: Implement checkout flow
    console.log('Order:', product, 'Quantity:', quantity);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: branding.font_family || 'inherit',
        background: branding.dark_mode
          ? 'linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 10%) 100%)'
          : 'linear-gradient(180deg, hsl(220 20% 97%) 0%, hsl(220 20% 100%) 100%)',
        color: branding.dark_mode ? 'hsl(0 0% 95%)' : 'inherit',
      }}
    >
      {/* Background decoration */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: branding.primary_color }}
      />
      <div 
        className="absolute bottom-0 left-0 w-48 h-48 md:w-80 md:h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: branding.accent_color }}
      />

      <div className="relative z-10 px-3 py-6 md:px-4 md:py-8 lg:py-12 max-w-5xl mx-auto">
        {/* Header - Compact on mobile */}
        <div className="text-center mb-6 md:mb-10">
          {branding.logo_url && (
            <img
              src={branding.logo_url}
              alt={`${company.name} logo`}
              className="h-10 md:h-14 mx-auto mb-3 md:mb-4 object-contain"
            />
          )}
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {company.name}
          </h1>
          <p
            className="text-sm md:text-base max-w-md mx-auto"
            style={{ color: branding.dark_mode ? 'hsl(0 0% 65%)' : 'hsl(0 0% 45%)' }}
          >
            Choose the perfect lead package
          </p>
        </div>

        {/* Pricing Grid - Mobile first */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-stretch">
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
          <div className="text-center py-12">
            <p 
              className="text-sm"
              style={{ color: branding.dark_mode ? 'hsl(0 0% 65%)' : 'hsl(0 0% 45%)' }}
            >
              No products available at this time.
            </p>
          </div>
        )}

        {/* Footer - Minimal */}
        {company.contact_email && (
          <div className="mt-8 md:mt-12 text-center">
            <p
              className="text-xs md:text-sm"
              style={{ color: branding.dark_mode ? 'hsl(0 0% 55%)' : 'hsl(0 0% 50%)' }}
            >
              Questions?{' '}
              <a
                href={`mailto:${company.contact_email}`}
                style={{ color: branding.primary_color }}
                className="hover:underline font-medium"
              >
                {company.contact_email}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
