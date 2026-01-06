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
            ? '#000000'
            : 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)',
        }}
      >
        <div className="px-3 py-6 md:px-4 md:py-8 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <Skeleton className="h-10 w-32 mx-auto mb-3 rounded-xl" />
            <Skeleton className="h-6 w-48 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
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
      className={`min-h-screen relative overflow-hidden ${branding.dark_mode ? 'animated-gradient-bg-dark' : 'animated-gradient-bg'}`}
      style={{
        fontFamily: branding.font_family || 'inherit',
        color: branding.dark_mode ? '#FFFFFF' : 'inherit',
      }}
    >
      {/* Floating orbs background - vibrant gradients */}
      <div 
        className="floating-orb w-[300px] h-[300px] md:w-[500px] md:h-[500px] top-[-100px] right-[-100px] md:top-[-150px] md:right-[-100px]"
        style={{ 
          background: branding.dark_mode 
            ? 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'
            : `radial-gradient(circle, ${branding.primary_color}60 0%, transparent 70%)`,
          opacity: branding.dark_mode ? 0.2 : 0.4,
          animationDelay: '0s',
        }}
      />
      <div 
        className="floating-orb w-[250px] h-[250px] md:w-[400px] md:h-[400px] bottom-[-50px] left-[-80px] md:bottom-[-100px] md:left-[-100px]"
        style={{ 
          background: branding.dark_mode 
            ? 'linear-gradient(135deg, #6366F1 0%, #D946EF 100%)'
            : `radial-gradient(circle, ${branding.accent_color}50 0%, transparent 70%)`,
          opacity: branding.dark_mode ? 0.15 : 0.4,
          animationDelay: '-7s',
        }}
      />
      <div 
        className="floating-orb w-[200px] h-[200px] md:w-[300px] md:h-[300px] top-[40%] left-[50%] hidden md:block"
        style={{ 
          background: branding.dark_mode 
            ? 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)'
            : `radial-gradient(circle, ${branding.cta_color}30 0%, transparent 70%)`,
          opacity: branding.dark_mode ? 0.1 : 0.4,
          animationDelay: '-14s',
        }}
      />

      {/* Subtle dot pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${branding.dark_mode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: branding.dark_mode ? 1 : 0.3,
        }}
      />

      <div className="relative z-10 px-3 py-5 md:px-4 md:py-8 lg:py-10 max-w-5xl mx-auto">
        {/* Header - Compact on mobile */}
        <div className="text-center mb-5 md:mb-8">
          {branding.logo_url && (
            <div className="relative inline-block mb-3 md:mb-4">
              <div 
                className="absolute inset-0 blur-2xl opacity-50 rounded-full"
                style={{ background: branding.primary_color }}
              />
              <img
                src={branding.logo_url}
                alt={`${company.name} logo`}
                className="relative h-10 md:h-12 lg:h-14 mx-auto object-contain"
              />
            </div>
          )}
          <h1
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 md:mb-2"
            style={{
              background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.accent_color}, ${branding.primary_color})`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 4s ease infinite',
            }}
          >
            {company.name}
          </h1>
          <p
            className="text-xs md:text-sm max-w-sm mx-auto"
            style={{ color: branding.dark_mode ? 'rgba(255, 255, 255, 0.75)' : 'hsl(0 0% 45%)' }}
          >
            Choose the perfect lead package for your business
          </p>
        </div>

        {/* Pricing Grid - Mobile first with tighter gaps */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-5 items-stretch">
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
              style={{ color: branding.dark_mode ? 'rgba(255, 255, 255, 0.5)' : 'hsl(0 0% 45%)' }}
            >
              No products available at this time.
            </p>
          </div>
        )}

        {/* Footer - Minimal */}
        {company.contact_email && (
          <div className="mt-6 md:mt-10 text-center">
            <p
              className="text-xs"
              style={{ color: branding.dark_mode ? 'rgba(255, 255, 255, 0.5)' : 'hsl(0 0% 50%)' }}
            >
              Questions?{' '}
              <a
                href={`mailto:${company.contact_email}`}
                style={{ color: branding.primary_color }}
                className="hover:underline font-medium transition-colors"
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