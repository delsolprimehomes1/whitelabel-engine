import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          White-Label Pricing System
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A production-ready SaaS platform for managing life insurance lead pricing pages. 
          Create unlimited branded checkout pages with centralized Stripe payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/auth">
              Admin Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
