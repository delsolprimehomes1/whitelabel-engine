import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyBySlug } from '@/hooks/useCompanyPage';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

interface OrderDetails {
  lead_product_id: string;
  lead_name: string;
  price_per_lead: number;
  quantity: number;
  company_id: string;
  company_name: string;
}

function CheckoutForm({
  branding,
  orderDetails,
  companySlug,
  companyName,
  onBack,
}: {
  branding: any;
  orderDetails: OrderDetails;
  companySlug: string;
  companyName: string;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const isDark = branding.dark_mode;
  const totalAmount = orderDetails.price_per_lead * orderDetails.quantity;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!customerEmail || !validateEmail(customerEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    setProcessing(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${companySlug}/success`,
          payment_method_data: {
            billing_details: {
              name: customerName || undefined,
              email: customerEmail,
            },
          },
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast.error(error.message || 'Payment failed');
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
      // If no error, stripe.confirmPayment redirects automatically
    } catch (err: any) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: isDark ? '#FFFFFF' : '#0A0A0A',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-colors"
        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to pricing
      </button>

      {/* Order Summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
        >
          Order Summary
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}>{orderDetails.lead_name}</span>
          <span style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
            ${orderDetails.price_per_lead.toFixed(2)} × {orderDetails.quantity}
          </span>
        </div>
        <div
          className="border-t pt-2 mt-2 flex justify-between items-center"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <span className="font-semibold" style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}>
            Total
          </span>
          <span className="text-lg font-bold" style={{ color: branding.primary_color }}>
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Doe"
            style={inputStyle}
            maxLength={100}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
          >
            Email Address <span style={{ color: branding.cta_color }}>*</span>
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="john@example.com"
            required
            style={{
              ...inputStyle,
              borderColor: emailError ? '#ef4444' : inputStyle.borderColor,
            }}
            maxLength={255}
          />
          {emailError && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{emailError}</p>
          )}
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
        >
          Payment Details <span style={{ color: branding.cta_color }}>*</span>
        </label>
        <div
          className="rounded-2xl p-4"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3.5 rounded-2xl text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: processing
            ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            : `linear-gradient(135deg, ${branding.cta_color}, ${branding.primary_color})`,
          opacity: (!stripe || processing) ? 0.7 : 1,
          cursor: (!stripe || processing) ? 'not-allowed' : 'pointer',
        }}
      >
        <Lock className="w-4 h-4" />
        {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <ShieldCheck className="w-4 h-4" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
        <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
          Secured with 256-bit SSL encryption
        </p>
      </div>
    </form>
  );
}

export default function BrandedCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: company, isLoading: companyLoading } = useCompanyBySlug(slug);

  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderDetails = location.state as OrderDetails | null;

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

  // Load Stripe publishable key
  useEffect(() => {
    async function loadKey() {
      try {
        const { data, error } = await supabase.functions.invoke('get-stripe-key');
        if (error || !data?.publishable_key) throw new Error('Failed to load payment config');
        setStripePromise(loadStripe(data.publishable_key));
      } catch (e) {
        setError('Unable to initialize payment system.');
      }
    }
    loadKey();
  }, []);

  // Create PaymentIntent once we have order details + company
  useEffect(() => {
    if (!orderDetails || !company) return;

    async function createIntent() {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            company_id: company!.id,
            company_slug: company!.slug,
            company_name: company!.name,
            lead_product_id: orderDetails!.lead_product_id,
            lead_name: orderDetails!.lead_name,
            price_per_lead: orderDetails!.price_per_lead,
            quantity: orderDetails!.quantity,
            page_path: `/${company!.slug}`,
            customer_email: null,
            customer_name: null,
          },
        });

        if (error || !data?.client_secret) throw new Error('Failed to create payment session');
        setClientSecret(data.client_secret);
      } catch (e) {
        setError('Failed to initialize checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    createIntent();
  }, [orderDetails, company]);

  // No order details = redirect back
  if (!orderDetails) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: isDark ? '#000000' : '#FFFFFF' }}
      >
        <div className="text-center">
          <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            No order details found.
          </p>
          <button
            onClick={() => navigate(`/${slug}`)}
            className="mt-4 underline"
            style={{ color: branding.primary_color }}
          >
            Return to pricing
          </button>
        </div>
      </div>
    );
  }

  if (companyLoading || loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: isDark ? '#000000' : '#FAFAFA' }}
      >
        <div className="max-w-lg mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: isDark ? '#000000' : '#FFFFFF' }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}>{error}</p>
          <button
            onClick={() => navigate(`/${slug}`)}
            className="underline"
            style={{ color: branding.primary_color }}
          >
            Return to pricing
          </button>
        </div>
      </div>
    );
  }

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
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[200px] -right-[150px] w-[400px] h-[400px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: branding.primary_color }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          {branding.logo_url && (
            <img
              src={branding.logo_url}
              alt={`${company?.name} logo`}
              className="h-8 md:h-10 mx-auto mb-4 object-contain"
            />
          )}
          <h1
            className="text-xl md:text-2xl font-bold"
            style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
          >
            Complete Your Order
          </h1>
        </div>

        {/* Stripe Elements */}
        {stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: isDark ? 'night' : 'stripe',
                variables: {
                  colorPrimary: branding.primary_color,
                  borderRadius: '12px',
                  fontFamily: branding.font_family || 'system-ui, -apple-system, sans-serif',
                },
              },
            }}
          >
            <CheckoutForm
              branding={branding}
              orderDetails={orderDetails}
              companySlug={slug!}
              companyName={company?.name || ''}
              onBack={() => navigate(`/${slug}`)}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
