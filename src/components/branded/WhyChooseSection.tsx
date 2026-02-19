import { CheckCircle, Shield, Clock, Zap, BarChart2, Users } from 'lucide-react';

interface Branding {
  primary_color: string;
  accent_color: string;
  cta_color: string;
  dark_mode: boolean;
}

interface WhyChooseSectionProps {
  companyName: string;
  branding: Branding;
}

const features = [
  {
    icon: CheckCircle,
    title: 'Pre-Qualified Leads',
    description: 'Every lead is vetted and screened to match your ideal customer profile before delivery.',
  },
  {
    icon: Shield,
    title: 'Exclusive Leads',
    description: 'Your leads are never resold or shared — you get 100% exclusive access to every contact.',
  },
  {
    icon: Clock,
    title: 'Real-Time Delivery',
    description: "Leads are delivered instantly to your CRM or inbox the moment they're generated.",
  },
  {
    icon: Zap,
    title: 'High Conversion Rate',
    description: 'Our leads convert at industry-leading rates, giving you the best ROI for every dollar.',
  },
  {
    icon: BarChart2,
    title: 'Performance Tracking',
    description: 'Access real-time dashboards and reports to monitor lead quality and campaign results.',
  },
  {
    icon: Users,
    title: 'CRM Integration',
    description: 'Seamlessly connect with Salesforce, HubSpot, and 50+ CRM platforms out of the box.',
  },
];

export function WhyChooseSection({ companyName, branding }: WhyChooseSectionProps) {
  const { primary_color, accent_color, dark_mode: isDark } = branding;

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain = isDark ? '#FFFFFF' : '#0A0A0A';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const iconBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <section className="mt-20 md:mt-28">
      {/* Section heading */}
      <div className="text-center mb-12">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
          style={{ color: textMain }}
        >
          Why Choose{' '}
          <span style={{ color: primary_color }}>{companyName}</span>{' '}
          <span style={{ color: accent_color }}>Leads</span>
        </h2>
        <p className="text-base max-w-lg mx-auto" style={{ color: textMuted }}>
          We don't just deliver leads — we deliver opportunities engineered to convert.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="relative rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Icon pill */}
            <div
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
              style={{ background: iconBg, border: `1px solid ${cardBorder}` }}
            >
              <Icon size={20} style={{ color: primary_color }} strokeWidth={1.75} />
            </div>

            <div>
              <h3 className="font-semibold text-sm md:text-base mb-1" style={{ color: textMain }}>
                {title}
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: textMuted }}>
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
