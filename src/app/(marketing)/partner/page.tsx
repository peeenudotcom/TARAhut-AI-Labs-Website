import type { Metadata } from 'next';
import { PartnerForm } from './partner-form';
import { PartnerPunjabMap } from '@/components/landing/partner-punjab-map';

export const metadata: Metadata = {
  title: 'Partner with TARAhut · Lab-in-a-Box | Own the AI Future of Your City',
  description:
    "The First AI Lab was Kotkapura. Yours is next. Launch a TARAhut AI Lab in your city with proven curriculum, TARA AI technology, and the lead systems that fill our Kotkapura center.",
};

const MONO = 'var(--font-fira-code), ui-monospace, monospace';
const DISPLAY = 'var(--font-space-grotesk), system-ui, sans-serif';

// ─────────────────────────────────────────────────────────────
// The three pillars of Lab-in-a-Box
// ─────────────────────────────────────────────────────────────

const PILLARS = [
  {
    tag: '01 · CURRICULUM',
    icon: '🧠',
    title: 'The Brain',
    subtitle: '16 tested sessions. Written, iterated, shipped.',
    body:
      'You inherit the full Master syllabus — 16 sessions across AI foundations, prompt engineering, content, automation, and monetisation. Tested with every cohort in Kotkapura. Every project, every assignment, every rubric is ready to run on day one.',
    proof: [
      '16-session syllabus · English · Hindi · Punjabi',
      'Prompt libraries + project briefs + grading rubrics',
      'Trainer manual — lesson-by-lesson playbook',
    ],
  },
  {
    tag: '02 · TECHNOLOGY',
    icon: '🤖',
    title: 'The Platform',
    subtitle: 'TARA, the Galaxy, and the automation backend — already built.',
    body:
      "You don't build the stack — you plug into ours. TARA handles 24/7 enquiries on your subdomain. The Galaxy UI and the course dashboards are the same ones running on tarahutailabs.com. Payments, enrolment tracking, WhatsApp automation — wired in from day one.",
    proof: [
      'TARA bot on your city subdomain',
      'Emerald Galaxy + landing-page themes already built',
      'Razorpay + WhatsApp + admin dashboard plumbed in',
    ],
  },
  {
    tag: '03 · LEADS',
    icon: '📈',
    title: 'The Funnel',
    subtitle: 'Career Architect and ROI calculators that convert.',
    body:
      'The lead magnets that filled Kotkapura are yours to deploy. Career Architect diagnoses the right course for a student in 3 steps. ROI calculators make the case parents and professionals need. Same funnel, your city — pre-tuned, ready to run paid campaigns against.',
    proof: [
      'Career Architect lead magnet + PDF roadmap',
      'Role-based ROI calculators (hours reclaimed · freelancing income)',
      'Ad templates + Meta pixel setup + landing-page copy bank',
    ],
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Enquiry', desc: 'Fill out the form below with your city, space, and investment capacity.' },
  { step: '02', title: 'Discovery Call', desc: 'Our team calls you within 24 hours to walk through the model + unit economics.' },
  { step: '03', title: 'Site Visit & Agreement', desc: 'We visit your space, finalise district exclusivity, and sign the partnership.' },
  { step: '04', title: 'Launch Your Lab', desc: 'Trainer onboarding, subdomain setup, and your first cohort live within 4 weeks.' },
];

const WHAT_YOU_GET = [
  { emoji: '📚', label: 'Full 16-session curriculum + trainer manual + grading rubrics' },
  { emoji: '🌐', label: 'Your own city subdomain (e.g. ludhiana.tarahutailabs.com) with TARA' },
  { emoji: '🎨', label: 'Brand kit · landing page themes · social templates · poster kit' },
  { emoji: '🎯', label: 'Career Architect + ROI Calculator lead magnets pre-configured' },
  { emoji: '📈', label: 'Meta pixel + Google Analytics + enrolment dashboard' },
  { emoji: '💬', label: 'WhatsApp automation + Razorpay payments + admin back-office' },
  { emoji: '👥', label: 'Trainer onboarding (5 days intensive at Kotkapura HQ)' },
  { emoji: '🛡️', label: 'District exclusivity for the duration of the partnership' },
];

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function PartnerPage() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Blueprint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Ambient emerald orbs */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-60 pointer-events-none"
          style={{ background: 'rgba(16,185,129,0.14)' }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-20 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50 pointer-events-none"
          style={{ background: 'rgba(16,185,129,0.1)' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="text-center">
            <span
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.32em] uppercase text-emerald-400"
              style={{ fontFamily: MONO }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Regional Expansion · 2026
            </span>

            <h1
              className="mt-5 text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight"
              style={{ fontFamily: DISPLAY }}
            >
              <span className="text-white">The first AI Lab was</span>{' '}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Kotkapura.</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Yours is next.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Own a TARAhut AI Lab in your district. Inherit the curriculum,
              the technology, and the lead systems that filled our Kotkapura
              center. No R&amp;D. No guesswork. A real business on day one.
            </p>

            {/* HQ stats strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  <span className="text-white font-bold">500+</span> students served at Kotkapura HQ
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/15" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  <span className="text-white font-bold">10+</span> districts targeted for 2026
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/15" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  Model: <span className="text-white font-bold">Lab-in-a-Box</span>
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 md:mt-12">
              <PartnerPunjabMap />
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#enquiry"
                className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase text-black bg-white hover:bg-emerald-500 hover:text-white transition-colors shadow-[0_10px_40px_rgba(16,185,129,0.2)]"
              >
                <span>Apply for Franchise Details</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#pillars"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border border-white/15 text-sm font-bold tracking-[0.15em] uppercase text-gray-300 hover:border-emerald-400/40 hover:text-emerald-300 transition-colors"
              >
                See the Model
              </a>
            </div>

            <p className="mt-6 text-[11px] tracking-[0.22em] uppercase text-gray-500 font-bold" style={{ fontFamily: MONO }}>
              Exclusivity granted per district · Batch 1 partners now open
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE 3 PILLARS ═══════════ */}
      <section id="pillars" className="relative py-20 md:py-28 bg-[#040914]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-20">
            <span
              className="text-[11px] sm:text-xs font-bold tracking-[0.32em] uppercase text-emerald-400"
              style={{ fontFamily: MONO }}
            >
              The Lab-in-a-Box
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
              style={{ fontFamily: DISPLAY }}
            >
              We&apos;ve already solved the <span className="text-gray-500">three hardest problems</span>
              <br />of running an AI school.
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
              Most education franchises sell a brand. We hand you a <em className="not-italic text-white">working system</em> — the same one that built Kotkapura.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {PILLARS.map((p) => (
              <div
                key={p.tag}
                className="grid md:grid-cols-5 gap-6 md:gap-10 p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-400/30 transition-colors"
              >
                <div className="md:col-span-3">
                  <div
                    className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400"
                    style={{ fontFamily: MONO }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {p.tag}
                  </div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-3xl" aria-hidden>{p.icon}</span>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: DISPLAY }}>
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-emerald-300/90">{p.subtitle}</p>
                  <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed">{p.body}</p>
                </div>

                <div className="md:col-span-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-4 md:p-5">
                  <div className="text-[10px] tracking-[0.28em] uppercase text-emerald-400/80 mb-3" style={{ fontFamily: MONO }}>
                    You get
                  </div>
                  <ul className="space-y-2.5">
                    {p.proof.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT YOU GET (FULL LIST) ═══════════ */}
      <section className="relative py-20 md:py-24 bg-[#020817]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400" style={{ fontFamily: MONO }}>
              Inside the Box
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              Everything in the partnership
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {WHAT_YOU_GET.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden>{item.emoji}</span>
                <span className="text-sm text-gray-200 leading-relaxed">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative py-20 md:py-24 bg-[#040914] border-y border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400" style={{ fontFamily: MONO }}>
              The Process
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              From enquiry to first cohort in 4 steps
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="relative p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div
                  className="text-4xl sm:text-5xl font-black tabular-nums mb-3"
                  style={{
                    fontFamily: DISPLAY,
                    background: 'linear-gradient(to bottom, rgba(16,185,129,0.6), rgba(16,185,129,0.12))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: DISPLAY }}>
                  {s.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ENQUIRY FORM ═══════════ */}
      <section id="enquiry" className="relative py-20 md:py-24 bg-[#020817] border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_520px]">
            {/* Left — info */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-400" style={{ fontFamily: MONO }}>
                Apply
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                Ready to own the future of your city?
              </h2>
              <p className="mt-4 text-gray-400">
                Partnership team responds within 24 hours. Discovery call is 30 minutes — we walk through the unit economics, district availability, and what a launch timeline looks like for your city.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-emerald-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Call us directly</p>
                    <a href="tel:+919915424411" className="text-sm text-emerald-400 hover:underline">+91 99154 24411</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-emerald-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp us</p>
                    <a href="https://wa.me/919200882008" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:underline">Chat on WhatsApp</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <div className="text-[10px] tracking-[0.28em] uppercase text-emerald-400 font-bold mb-2" style={{ fontFamily: MONO }}>
                  Batch 1 · Open
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Currently accepting first 5 city partners. Each gets <span className="text-white font-semibold">district exclusivity</span> for the duration of the agreement — one lab per district, no exceptions.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                Partner Enquiry Form
              </h2>
              <PartnerForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
