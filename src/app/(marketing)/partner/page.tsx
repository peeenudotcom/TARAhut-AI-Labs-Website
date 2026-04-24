import type { Metadata } from 'next';
import { PartnerForm } from './partner-form';

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
// Profit Projections — numbers are projections based on Kotkapura
// HQ trajectory. Tier-1 cities may run materially higher. A
// disclaimer is rendered inline so nothing reads as a guarantee.
// ─────────────────────────────────────────────────────────────

const REVENUE_STREAMS = [
  {
    tag: '01 · B2C',
    icon: '🎓',
    title: 'Enrollment',
    note: 'The volume',
    desc: '2 batches × 20 students × ₹9,999 blended (Tools Mastery + Master Builder)',
    amount: 400000,
  },
  {
    tag: '02 · B2B',
    icon: '🏢',
    title: 'Local Business Workshops',
    note: 'The high-ticket',
    desc: '2 business audits / AI transformation workshops @ ₹25,000',
    amount: 50000,
  },
  {
    tag: '03 · SERVICES',
    icon: '🔧',
    title: 'AI Implementation',
    note: 'The retention',
    desc: 'Custom GPT builds for local clients · delivered via student interns',
    amount: 30000,
  },
];

const OPERATING_COSTS = [
  { label: 'Rent & utilities',        note: '500–800 sq. ft. local space',          amount: 30000 },
  { label: 'Lab Manager',              note: '1 staff · facilitates the system',     amount: 20000 },
  { label: 'Marketing',                note: 'Digital ads + local ground',           amount: 30000 },
  { label: 'Technology & Royalty',     note: 'TARA bot + cloud infrastructure',      amount: 20000 },
  { label: 'Misc · maintenance',       note: '',                                     amount: 5000  },
];

const UNFAIR_ADVANTAGES = [
  {
    icon: '🎯',
    title: 'Lead Generation',
    body: 'Our Career Architect funnels qualified leads directly to your WhatsApp — pre-qualified, ready to talk. You wake up to enquiries, not to empty seats.',
  },
  {
    icon: '📚',
    title: 'Zero Syllabus Drift',
    body: 'We update the 16-session curriculum centrally. You never chase the tech — AI moves fast, our labs move with it, and your trainer manual refreshes automatically.',
  },
  {
    icon: '🛡️',
    title: '5km Exclusivity Radius',
    body: 'One TARAhut Lab per 5km. You dominate your local market without stepping on another partner, and no one else can ride your reputation.',
  },
];

// Industry benchmark for the comparison bar chart — conservative
// estimate of a typical small-town coaching centre's monthly profit.
// Labelled as "industry avg" so it never reads as a specific claim.
const MANUAL_EDU_BENCHMARK = 40000;

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const TOTAL_REVENUE = REVENUE_STREAMS.reduce((sum, s) => sum + s.amount, 0);
const TOTAL_COSTS   = OPERATING_COSTS.reduce((sum, c) => sum + c.amount, 0);
const NET_PROFIT    = TOTAL_REVENUE - TOTAL_COSTS;

const EXCLUSIVITY_WHATSAPP = `https://wa.me/919200882008?text=${encodeURIComponent('Hi TARAhut! I want to apply for district exclusivity for a TARAhut AI Lab. Please share the partnership details.')}`;

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
                  <span className="text-white font-bold">Kotkapura HQ</span> live · first cohorts running
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/15" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                <span className="text-gray-500">
                  <span
                    className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px]"
                    style={{ fontFamily: MONO }}
                  >
                    Target
                  </span>
                  <span className="mx-1.5">·</span>
                  <span className="text-gray-300">500+ students across Punjab by 2026</span>
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
                href="#economics"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-4 rounded-full border border-white/15 text-sm font-bold tracking-[0.15em] uppercase text-gray-300 hover:border-emerald-400/40 hover:text-emerald-300 transition-colors"
              >
                See the Economics
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

      {/* ═══════════ PROFIT PROJECTIONS ═══════════ */}
      <section id="economics" className="relative py-20 md:py-28 bg-[#020817] border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <span
              className="text-[11px] sm:text-xs font-bold tracking-[0.32em] uppercase text-emerald-400"
              style={{ fontFamily: MONO }}
            >
              The Economics · Projections
            </span>
            <h2
              className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]"
              style={{ fontFamily: DISPLAY }}
            >
              What a Partner Lab <span className="text-gray-500">prints.</span>
            </h2>
          </div>

          {/* Disclaimer strip */}
          <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
            <p className="text-[11px] sm:text-xs text-gray-500 tracking-wide leading-relaxed" style={{ fontFamily: MONO }}>
              # projections based on kotkapura hq trajectory · tier-1 cities (ludhiana · amritsar) may run ~2× higher due to pricing elasticity · actuals depend on location, execution, market
            </p>
          </div>

          {/* Revenue streams — 3 cards */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                01 · Revenue streams
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] sm:text-[11px] text-gray-500 tracking-wide" style={{ fontFamily: MONO }}>
                monthly
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {REVENUE_STREAMS.map((s) => (
                <div
                  key={s.tag}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 hover:border-emerald-400/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl" aria-hidden>{s.icon}</span>
                    <span
                      className="text-[10px] font-bold tracking-[0.28em] text-emerald-400"
                      style={{ fontFamily: MONO }}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-emerald-300/80 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                    {s.note}
                  </p>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <div
                      className="text-2xl sm:text-3xl font-extrabold tabular-nums"
                      style={{
                        fontFamily: DISPLAY,
                        background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {rupees(s.amount)}
                    </div>
                    <div className="mt-0.5 text-[10px] text-gray-600 tracking-[0.22em] uppercase" style={{ fontFamily: MONO }}>
                      per month
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue total */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-4">
              <span
                className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-emerald-300 uppercase"
                style={{ fontFamily: MONO }}
              >
                Total gross revenue
              </span>
              <span
                className="text-2xl sm:text-3xl font-extrabold text-emerald-300 tabular-nums"
                style={{ fontFamily: DISPLAY }}
              >
                {rupees(TOTAL_REVENUE)}<span className="text-sm text-emerald-400/70 ml-2">/mo</span>
              </span>
            </div>
          </div>

          {/* Operating costs — lean ledger */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                02 · Operating costs
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] sm:text-[11px] text-gray-500 tracking-wide" style={{ fontFamily: MONO }}>
                monthly
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06]">
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-white font-semibold">The system is the teacher.</span> No high-paid AI experts —
                  your lab manager facilitates TARAhut IP rather than generating it. That&apos;s the structural advantage.
                </p>
              </div>
              <ul className="divide-y divide-white/[0.05]">
                {OPERATING_COSTS.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3.5">
                    <span className="flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-medium text-gray-200">{c.label}</div>
                      {c.note && (
                        <div className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: MONO }}>
                          {c.note}
                        </div>
                      )}
                    </div>
                    <div
                      className="text-sm sm:text-base font-bold tabular-nums shrink-0 text-gray-300"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {rupees(c.amount)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-5 sm:px-6 py-4 border-t border-emerald-500/20 bg-emerald-500/[0.04] flex items-center justify-between">
                <span
                  className="text-[11px] font-bold tracking-[0.28em] uppercase text-emerald-300"
                  style={{ fontFamily: MONO }}
                >
                  Total opex
                </span>
                <span
                  className="text-xl sm:text-2xl font-extrabold text-emerald-300 tabular-nums"
                  style={{ fontFamily: DISPLAY }}
                >
                  {rupees(TOTAL_COSTS)}<span className="text-xs text-emerald-400/70 ml-2">/mo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Net profit readout */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                03 · Net profit
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] sm:text-[11px] text-gray-500 tracking-wide" style={{ fontFamily: MONO }}>
                year one
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="text-left border-b border-white/[0.06]">
                    <th className="px-5 sm:px-6 py-3 text-[10px] font-bold tracking-[0.22em] uppercase text-gray-500" style={{ fontFamily: MONO }}>
                      Line
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-right text-[10px] font-bold tracking-[0.22em] uppercase text-gray-500" style={{ fontFamily: MONO }}>
                      Monthly
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-right text-[10px] font-bold tracking-[0.22em] uppercase text-gray-500" style={{ fontFamily: MONO }}>
                      Annual · Y1
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  <tr>
                    <td className="px-5 sm:px-6 py-3.5 text-gray-300">Gross revenue</td>
                    <td className="px-5 sm:px-6 py-3.5 text-right font-bold tabular-nums text-gray-200" style={{ fontFamily: DISPLAY }}>{rupees(TOTAL_REVENUE)}</td>
                    <td className="px-5 sm:px-6 py-3.5 text-right font-bold tabular-nums text-gray-200" style={{ fontFamily: DISPLAY }}>{rupees(TOTAL_REVENUE * 12)}</td>
                  </tr>
                  <tr>
                    <td className="px-5 sm:px-6 py-3.5 text-gray-300">Operating costs</td>
                    <td className="px-5 sm:px-6 py-3.5 text-right font-bold tabular-nums text-gray-400" style={{ fontFamily: DISPLAY }}>−{rupees(TOTAL_COSTS)}</td>
                    <td className="px-5 sm:px-6 py-3.5 text-right font-bold tabular-nums text-gray-400" style={{ fontFamily: DISPLAY }}>−{rupees(TOTAL_COSTS * 12)}</td>
                  </tr>
                  <tr className="bg-emerald-500/[0.04] border-t border-emerald-500/20">
                    <td className="px-5 sm:px-6 py-4 text-emerald-300 font-bold tracking-wide uppercase text-xs sm:text-sm">Net profit</td>
                    <td className="px-5 sm:px-6 py-4 text-right text-xl sm:text-2xl font-extrabold tabular-nums text-emerald-300" style={{ fontFamily: DISPLAY }}>
                      {rupees(NET_PROFIT)}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-right text-xl sm:text-2xl font-extrabold tabular-nums text-emerald-300" style={{ fontFamily: DISPLAY }}>
                      {rupees(NET_PROFIT * 12)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison bar chart — manual vs AI-native */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                04 · The delta
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] sm:text-[11px] text-gray-500 tracking-wide" style={{ fontFamily: MONO }}>
                monthly profit
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-7">
              {/* Row 1 — Manual education */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-gray-400 font-semibold">Traditional coaching centre</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-[0.22em]" style={{ fontFamily: MONO }}>
                    industry avg
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative h-6 rounded-full bg-white/[0.03] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gray-600/70"
                      style={{ width: `${(MANUAL_EDU_BENCHMARK / NET_PROFIT) * 100}%` }}
                    />
                  </div>
                  <div
                    className="text-base sm:text-lg font-bold tabular-nums text-gray-400 w-28 text-right"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {rupees(MANUAL_EDU_BENCHMARK)}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-600" style={{ fontFamily: MONO }}>
                  # one revenue line · teacher-heavy opex · syllabus drift
                </p>
              </div>

              {/* Row 2 — TARAhut */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-emerald-300 font-semibold">TARAhut Partner Lab</span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-[0.22em]" style={{ fontFamily: MONO }}>
                    projection
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative h-6 rounded-full bg-white/[0.03] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                        boxShadow: '0 0 30px rgba(16,185,129,0.35)',
                      }}
                    />
                  </div>
                  <div
                    className="text-base sm:text-lg font-extrabold tabular-nums text-emerald-300 w-28 text-right"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {rupees(NET_PROFIT)}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-emerald-400/70" style={{ fontFamily: MONO }}>
                  # 3 revenue streams · platform-powered opex · central syllabus updates
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                <p className="text-sm text-gray-300">
                  That&apos;s a{' '}
                  <span
                    className="font-bold text-emerald-300 tabular-nums"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {Math.round(NET_PROFIT / MANUAL_EDU_BENCHMARK)}×
                  </span>{' '}
                  delta — structural, not promotional. Different model, different math.
                </p>
              </div>
            </div>
          </div>

          {/* ROI + Break-even card */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                05 · Capital plan
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {[
                { kpi: '₹8–12L', label: 'Initial Capex', note: 'Franchise fee + interior branding + high-speed lab setup' },
                { kpi: '3–5 mo', label: 'Break-Even', note: 'From first cohort live to profit' },
                { kpi: '~300%', label: 'ROI · Year 18mo', note: 'At projected capacity — Tier-1 runs higher' },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.02] p-5"
                >
                  <div
                    className="text-3xl sm:text-4xl font-extrabold tabular-nums"
                    style={{
                      fontFamily: DISPLAY,
                      background: 'linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {k.kpi}
                  </div>
                  <div className="mt-2 text-[11px] tracking-[0.28em] uppercase text-emerald-300 font-bold" style={{ fontFamily: MONO }}>
                    {k.label}
                  </div>
                  <div className="mt-1.5 text-xs text-gray-500 leading-relaxed">{k.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Unfair Advantages */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase"
                style={{ fontFamily: MONO }}
              >
                06 · The unfair advantage
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {UNFAIR_ADVANTAGES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 hover:border-emerald-400/30 transition-colors"
                >
                  <div className="text-3xl mb-3" aria-hidden>{a.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: DISPLAY }}>
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* District Exclusivity footer CTA */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent p-6 md:p-8 text-center">
            <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] uppercase text-emerald-400 mb-3" style={{ fontFamily: MONO }}>
              # batch_1 · open · limited
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: DISPLAY }}>
              Apply for District Exclusivity
            </h3>
            <p className="mt-3 text-sm md:text-base text-gray-400 max-w-xl mx-auto">
              One TARAhut Lab per 5km. First partners in each district get the market. WhatsApp us and we&apos;ll lock your area in the first discovery call.
            </p>
            <a
              href={EXCLUSIVITY_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 mt-6 px-8 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase text-black bg-white hover:bg-emerald-500 hover:text-white transition-colors shadow-[0_10px_40px_rgba(16,185,129,0.2)]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp the Partnership Team
            </a>
            <p className="mt-4 text-[11px] text-gray-500 tracking-[0.22em] uppercase" style={{ fontFamily: MONO }}>
              or scroll down · fill the enquiry form
            </p>
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
