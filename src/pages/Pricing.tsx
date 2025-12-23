import { PricingGrid } from '@/components/pricing/PricingGrid';
import { LeadProduct } from '@/hooks/useLeadProducts';
import { toast } from 'sonner';

export default function Pricing() {
  const handleOrder = (product: LeadProduct) => {
    toast.info(`Order functionality for "${product.name}" coming soon!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lead Marketplace</h1>
          <nav className="flex gap-4">
            <a href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin Login
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Premium Insurance Leads
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            High-quality, verified leads to grow your insurance business
          </p>
          <p className="text-muted-foreground">
            All leads are exclusive, verified, and delivered in real-time
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <PricingGrid onOrder={handleOrder} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lead Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
