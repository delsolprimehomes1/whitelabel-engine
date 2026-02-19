interface Branding {
  primary_color: string;
  accent_color: string;
  cta_color: string;
  dark_mode: boolean;
}

interface HowItWorksSectionProps {
  branding: Branding;
}

const steps = [
  {
    number: '01',
    title: 'Select Lead Type',
    description: 'Choose from exclusive, real-time, or aged leads based on your budget and goals.',
  },
  {
    number: '02',
    title: 'Define Territory',
    description: 'Set your target geography — city, state, zip code, or nationwide coverage.',
  },
  {
    number: '03',
    title: 'Setup CRM',
    description: 'Connect your CRM or email in minutes using our native integrations.',
  },
  {
    number: '04',
    title: 'Receive Leads',
    description: 'Leads flow directly into your pipeline, fully formatted and ready to contact.',
  },
  {
    number: '05',
    title: 'Connect & Convert',
    description: 'Reach out instantly to close more deals with warm, pre-qualified prospects.',
  },
];

export function HowItWorksSection({ branding }: HowItWorksSectionProps) {
  const { primary_color, dark_mode: isDark } = branding;

  const textMain = isDark ? '#FFFFFF' : '#0A0A0A';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const numberBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  return (
    <section className="mt-20 md:mt-28">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
          style={{ color: textMain }}
        >
          How It{' '}
          <span style={{ color: primary_color }}>Works</span>
        </h2>
        <p className="text-base max-w-lg mx-auto" style={{ color: textMuted }}>
          From selection to conversion — a simple 5-step process designed for speed and results.
        </p>
      </div>

      {/* Steps — horizontal scroll on mobile, row on desktop */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex flex-col md:flex-row gap-0 overflow-x-auto pb-2 md:pb-0 -mx-1 px-1">
          {steps.map((step, index) => (
            <div key={step.number} className="flex md:flex-col items-start md:items-center flex-1 min-w-[200px]">
              {/* Step content */}
              <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1 py-4 md:py-0 md:px-4 md:text-center">
                {/* Number badge */}
                <div
                  className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-sm md:text-base"
                  style={{
                    background: numberBg,
                    border: `1.5px solid ${primary_color}40`,
                    color: primary_color,
                  }}
                >
                  {step.number}
                </div>

                <div className="flex-1 md:flex-none">
                  <h3
                    className="font-semibold text-sm md:text-base mb-1"
                    style={{ color: primary_color }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector — vertical on mobile, horizontal on desktop */}
              {index < steps.length - 1 && (
                <>
                  {/* Mobile vertical connector */}
                  <div
                    className="md:hidden w-px h-6 ml-5 shrink-0"
                    style={{ background: dividerColor }}
                  />
                  {/* Desktop horizontal connector */}
                  <div
                    className="hidden md:flex items-center justify-center w-px self-stretch mt-6"
                    style={{}}
                  >
                    <div className="w-full h-px" style={{ background: dividerColor }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
