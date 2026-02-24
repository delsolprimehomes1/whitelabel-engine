import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCompanyBySlug } from '@/hooks/useCompanyPage';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderData {
  id: string;
  total_amount: number;
  customer_email: string | null;
  items: { lead_name: string; quantity: number; price_per_lead: number }[];
}

export default function CheckoutSuccess() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { data: company } = useCompanyBySlug(slug);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

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

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId },
        });
        if (error) throw error;
        if (data?.success) {
          setOrder(data.order);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (e) {
        console.error('Payment verification failed:', e);
        setStatus('error');
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: branding.font_family || 'system-ui, -apple-system, sans-serif',
        background: isDark
          ? 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)'
          : 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
      }}
    >
      <div className="max-w-md w-full text-center">
        {branding.logo_url && (
          <img src={branding.logo_url} alt="Logo" className="h-10 mx-auto mb-6 object-contain" />
        )}

        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2
              className="h-12 w-12 mx-auto animate-spin"
              style={{ color: branding.primary_color }}
            />
            <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
              Verifying your payment…
            </p>
          </div>
        )}

        {status === 'success' && order && (
          <div className="space-y-6">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ background: `${branding.accent_color}20` }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: branding.accent_color }} />
            </div>

            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
              >
                Payment Successful!
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
              >
                Thank you for your order. A confirmation will be sent to{' '}
                <strong style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                  {order.customer_email}
                </strong>
              </p>
            </div>

            {/* Order summary */}
            <div
              className="rounded-2xl p-5 text-left space-y-3"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                Order Summary
              </h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
                    >
                      {item.lead_name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                    >
                      {item.quantity} × ${item.price_per_lead}
                    </p>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
                  >
                    ${(item.quantity * item.price_per_lead).toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                className="pt-3 flex justify-between items-center"
                style={{
                  borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
                >
                  Total
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: branding.primary_color }}
                >
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            {company?.contact_email && (
              <p
                className="text-xs"
                style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}
              >
                Questions?{' '}
                <a
                  href={`mailto:${company.contact_email}`}
                  className="underline"
                  style={{ color: branding.primary_color }}
                >
                  {company.contact_email}
                </a>
              </p>
            )}

            <Link to={`/${slug}`}>
              <Button
                className="w-full h-11 rounded-xl text-sm font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? '#FFFFFF' : '#0A0A0A',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                }}
              >
                Back to {company?.name || 'Pricing'}
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.15)' }}
            >
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}
              >
                Payment Issue
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
              >
                We couldn't verify your payment. Please try again or contact support.
              </p>
            </div>
            <Link to={`/${slug}`}>
              <Button
                className="w-full h-11 rounded-xl text-sm font-medium"
                style={{
                  background: branding.primary_color,
                  color: '#FFFFFF',
                }}
              >
                Try Again
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
