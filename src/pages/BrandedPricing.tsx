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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p className="text-muted-foreground">The pricing page you're looking for doesn't exist.</p>
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
            ? 'linear-gradient(180deg, hsl(222 47% 8%) 0%, hsl(222 47% 12%) 100%)'
            : 'linear-gradient(180deg, hsl(0 0% 98%) 0%, hsl(0 0% 100%) 100%)',
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Skeleton className="h-16 w-48 mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p className="text-muted-foreground">The pricing page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleOrder = (product: typeof displayProducts[0]) => {
    // TODO: Implement checkout flow
    console.log('Order:', product);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: branding.font_family || 'inherit',
        background: branding.dark_mode
          ? 'linear-gradient(180deg, hsl(222 47% 8%) 0%, hsl(222 47% 12%) 100%)'
          : 'linear-gradient(180deg, hsl(0 0% 98%) 0%, hsl(0 0% 100%) 100%)',
        color: branding.dark_mode ? 'hsl(0 0% 95%)' : 'inherit',
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {branding.logo_url && (
            <img
              src={branding.logo_url}
              alt={`${company.name} logo`}
              className="h-16 mx-auto mb-6 object-contain"
            />
          )}
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
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
            className="text-lg max-w-2xl mx-auto"
            style={{ color: branding.dark_mode ? 'hsl(0 0% 70%)' : 'hsl(0 0% 40%)' }}
          >
            Choose the perfect lead package for your business
          </p>
        </div>

        {/* Pricing Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((pageProduct) => (
              <BrandedPricingCard
                key={pageProduct.id}
                pageProduct={pageProduct}
                branding={branding}
                onOrder={handleOrder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: branding.dark_mode ? 'hsl(0 0% 70%)' : 'hsl(0 0% 40%)' }}>
              No products available at this time.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          {company.contact_email && (
            <p
              className="text-sm"
              style={{ color: branding.dark_mode ? 'hsl(0 0% 60%)' : 'hsl(0 0% 50%)' }}
            >
              Questions? Contact us at{' '}
              <a
                href={`mailto:${company.contact_email}`}
                style={{ color: branding.primary_color }}
                className="hover:underline"
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
