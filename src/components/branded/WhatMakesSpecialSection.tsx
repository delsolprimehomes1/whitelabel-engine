import { Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface Branding {
  primary_color: string;
  accent_color: string;
  cta_color: string;
  dark_mode: boolean;
}

interface WhatMakesSpecialSectionProps {
  companyName: string;
  branding: Branding;
}

export function WhatMakesSpecialSection({ companyName, branding }: WhatMakesSpecialSectionProps) {
  const { primary_color, accent_color, dark_mode: isDark } = branding;

  const wrapperBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)';
  const wrapperBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textMain = isDark ? '#FFFFFF' : '#0A0A0A';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const iconBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <section className="mt-20 md:mt-28">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
          style={{ color: textMain }}
        >
          What Makes{' '}
          <span style={{ color: primary_color }}>{companyName}</span>{' '}
          <span style={{ color: accent_color }}>Special?</span>
        </h2>
        <p className="text-base max-w-lg mx-auto" style={{ color: textMuted }}>
          Two lead types. One unmatched quality standard. Built for every stage of your sales pipeline.
        </p>
      </div>

      {/* Main wrapper card */}
      <div
        className="rounded-3xl p-6 md:p-8"
        style={{
          background: wrapperBg,
          border: `1px solid ${wrapperBorder}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Two feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Fresh Leads */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{ background: iconBg, border: `1px solid ${cardBorder}` }}
            >
              <Sparkles size={22} style={{ color: primary_color }} strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-base md:text-lg" style={{ color: textMain }}>
                  Fresh Leads
                </h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${primary_color}20`,
                    color: primary_color,
                    border: `1px solid ${primary_color}30`,
                  }}
                >
                  Real-Time
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                Generated and delivered within minutes. These leads are actively searching for your services right now — strike while the iron is hot.
              </p>
              <ul className="mt-4 space-y-2">
                {['Delivered in real-time', 'Highest intent & conversion', 'Exclusive to your account'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: primary_color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Aged Leads */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{ background: iconBg, border: `1px solid ${cardBorder}` }}
            >
              <Clock size={22} style={{ color: accent_color }} strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-base md:text-lg" style={{ color: textMain }}>
                  Aged Leads
                </h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${accent_color}20`,
                    color: accent_color,
                    border: `1px solid ${accent_color}30`,
                  }}
                >
                  Budget-Friendly
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                Pre-screened contacts from our verified archive. Perfect for high-volume outreach at a fraction of the cost — with no compromise on quality.
              </p>
              <ul className="mt-4 space-y-2">
                {['Lower cost per lead', 'Pre-verified & scrubbed', 'Great for high-volume teams'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent_color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quality assurance badge pill */}
        <div className="flex items-center justify-center">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: `${accent_color}15`,
              border: `1px solid ${accent_color}35`,
              color: accent_color,
            }}
          >
            <ShieldCheck size={16} strokeWidth={2} />
            Quality Assured — Every Lead Verified Before Delivery
          </div>
        </div>
      </div>
    </section>
  );
}
