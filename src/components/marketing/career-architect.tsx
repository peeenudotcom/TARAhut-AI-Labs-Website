'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { courses } from '@/config/courses';
import { siteConfig } from '@/config/site';

// AI Career Architect — a three-step interactive diagnostic that
// reframes a standard lead form as "TARA is designing a custom
// education path." The WhatsApp field is the gate, the reveal is
// the value, and the CTA is the handoff.
//
// Flow: identity → ambition → contact → analyzing → result.

type Step = 'identity' | 'ambition' | 'contact' | 'analyzing' | 'result';

type Identity = 'student' | 'biz-owner' | 'freelancer' | 'professional';
type Ambition = 'save-time' | 'make-money' | 'get-job' | 'scale';

const IDENTITY_OPTIONS: { id: Identity; label: string; icon: string; sub: string }[] = [
  { id: 'student',       label: 'Student',       icon: '🎓', sub: 'Class 10 → College' },
  { id: 'biz-owner',     label: 'Biz Owner',     icon: '🏪', sub: 'Running a shop or brand' },
  { id: 'freelancer',    label: 'Freelancer',    icon: '💼', sub: 'Client work, solo operator' },
  { id: 'professional',  label: 'Professional',  icon: '🧑‍💻', sub: 'Salaried, in-house role' },
];

const AMBITION_OPTIONS: { id: Ambition; label: string; icon: string; sub: string }[] = [
  { id: 'save-time',  label: 'Save Time',  icon: '⚡', sub: 'Cut hours off daily work' },
  { id: 'make-money', label: 'Make Money', icon: '💰', sub: 'Earn with a new skill' },
  { id: 'get-job',    label: 'Get a Job',  icon: '🚀', sub: 'Land an AI-ready role' },
  { id: 'scale',      label: 'Scale',      icon: '📈', sub: 'Grow output 10×' },
];

interface Prescription {
  // The one course that best fits this profile — the buy decision.
  primarySlug: string;
  // Two supporting courses that cover adjacent needs.
  alternatives: [string, string];
  // Indices into the primary course's flattened session list (0-based).
  // Kept ≤ 11 so every course — smallest syllabus is 12 sessions —
  // has these three sessions available.
  highlightedIndices: [number, number, number];
  // Short "why this track" headline TARA shows on the result card.
  pitch: string;
}

// The full recommendation matrix — 4 identities × 4 ambitions = 16
// curated prescriptions. Authored here (not computed) so every
// reveal feels intentional and the strongest course for each
// profile gets the primary slot.
const RECOMMENDATIONS: Record<`${Identity}-${Ambition}`, Prescription> = {
  // STUDENT
  'student-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['ai-power-8-week-program', 'master-claude-15-days'],
    highlightedIndices: [0, 4, 6],
    pitch: 'Start with the fastest-compounding tool stack — ChatGPT, Claude, and research AI.',
  },
  'student-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-tools-mastery-beginners', 'master-ai-builder'],
    highlightedIndices: [0, 5, 10],
    pitch: 'The 45-day freelance runway — earn your first AI paycheck before graduation.',
  },
  'student-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'ai-hustler-45'],
    highlightedIndices: [0, 6, 11],
    pitch: '8 weeks, capstone project, portfolio — walk into interviews with proof, not promises.',
  },
  'student-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['generative-ai-prompt-engineering', 'ai-power-8-week-program'],
    highlightedIndices: [0, 4, 8],
    pitch: 'Go beyond prompting — build full-stack AI products and ship them to real users.',
  },

  // BIZ OWNER
  'biz-owner-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'ai-digital-marketing'],
    highlightedIndices: [2, 5, 7],
    pitch: 'The operator stack — write, research, and design faster than your competition.',
  },
  'biz-owner-make-money': {
    primarySlug: 'ai-digital-marketing',
    alternatives: ['master-ai-builder', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 4, 8],
    pitch: 'AI marketing is the cheapest growth lever you have. Master it in 12 weeks.',
  },
  'biz-owner-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'ai-hustler-45'],
    highlightedIndices: [0, 5, 10],
    pitch: 'Pivoting? The 8-week comprehensive path builds a portfolio hiring managers trust.',
  },
  'biz-owner-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['ai-digital-marketing', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 9],
    pitch: 'Automate the repetitive, productize the expertise — the 90-day builder path.',
  },

  // FREELANCER
  'freelancer-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 7],
    pitch: 'Bill the same, deliver 3× faster. The 13+ tool stack every freelancer needs.',
  },
  'freelancer-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-digital-marketing', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 8, 11],
    pitch: 'Designed for this. 45 days from zero to earning on Fiverr / Upwork / direct clients.',
  },
  'freelancer-get-job': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-power-8-week-program', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 10, 11],
    pitch: 'Freelance is the new job. Build a 45-day runway with real paying clients.',
  },
  'freelancer-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['ai-digital-marketing', 'generative-ai-prompt-engineering'],
    highlightedIndices: [1, 5, 10],
    pitch: 'Stop trading hours for money — ship products, build retainers, reclaim your calendar.',
  },

  // PROFESSIONAL
  'professional-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 6],
    pitch: 'Reclaim 10+ hours a week on the tools you already open daily.',
  },
  'professional-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-tools-mastery-beginners', 'ai-digital-marketing'],
    highlightedIndices: [2, 8, 10],
    pitch: 'Side income engine — AI skills that pay weekends, no resignation required.',
  },
  'professional-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'master-claude-15-days'],
    highlightedIndices: [0, 6, 11],
    pitch: '8-week comprehensive program — ship a capstone, build a portfolio, rewrite your resume.',
  },
  'professional-scale': {
    primarySlug: 'generative-ai-prompt-engineering',
    alternatives: ['master-ai-builder', 'master-claude-15-days'],
    highlightedIndices: [0, 5, 10],
    pitch: 'Stop using AI like a beginner. Advanced prompting + custom workflows at expert level.',
  },
};

// Flatten a course's nested syllabus into a linear session list.
// Strips the "Week N:" / "Module N:" prefix off the module heading
// so it can be used as a clean tag on each session card.
function flattenCourse(
  slug: string
): { n: number; title: string; tag: string }[] {
  const course = courses.find((c) => c.slug === slug);
  if (!course) return [];
  const sessions: { n: number; title: string; tag: string }[] = [];
  course.syllabus.forEach((mod) => {
    const tagMatch = mod.module.match(
      /^(Weeks?|Modules?|Phases?|Days?|Sprints?|Months?)\s+\d+\s*[:—-]\s*(.*)$/i
    );
    const tag = tagMatch ? tagMatch[2].trim() : mod.module;
    mod.topics.forEach((topic) => {
      sessions.push({ n: sessions.length + 1, title: topic, tag });
    });
  });
  return sessions;
}

function courseByslug(slug: string) {
  return courses.find((c) => c.slug === slug);
}

function getPrescription(identity: Identity, ambition: Ambition) {
  return RECOMMENDATIONS[`${identity}-${ambition}`];
}

function idLabel(arr: { id: string; label: string }[], id: string): string {
  return arr.find((o) => o.id === id)?.label ?? id;
}

// Slide-in animation shared across step panels. Short distance and
// tight easing so the flow feels snappy, not floaty.
const stepVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
};
const stepTransition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

export function CareerArchitect() {
  const [step, setStep] = useState<Step>('identity');
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [ambition, setAmbition] = useState<Ambition | null>(null);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  // Rotating status line during the "analyzing" pulse. Gives the
  // 3s of dead air real texture — the visitor watches TARA actually
  // work through their profile.
  const ANALYSIS_STATUSES = useMemo(
    () => [
      'Accessing syllabus…',
      'Matching role profile…',
      'Weighting sprints by goal…',
      'Finalizing roadmap…',
    ],
    []
  );
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (step !== 'analyzing') return;
    setStatusIndex(0);
    const cycle = window.setInterval(() => {
      setStatusIndex((i) => {
        const next = i + 1;
        if (next >= ANALYSIS_STATUSES.length) {
          window.clearInterval(cycle);
          setStep('result');
          return i;
        }
        return next;
      });
    }, 850);
    return () => window.clearInterval(cycle);
  }, [step, ANALYSIS_STATUSES.length]);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = whatsapp.replace(/\D/g, '');
    if (!name.trim()) {
      setError('Please tell us your name.');
      return;
    }
    if (digits.length < 10) {
      setError('Please enter a valid WhatsApp number.');
      return;
    }
    setError('');
    setStep('analyzing');
  }

  const prescription = useMemo(
    () => (identity && ambition ? getPrescription(identity, ambition) : null),
    [identity, ambition]
  );

  const primaryCourse = prescription ? courseByslug(prescription.primarySlug) : null;
  const primarySessions = useMemo(
    () => (prescription ? flattenCourse(prescription.primarySlug) : []),
    [prescription]
  );
  const highlightedSessions = useMemo(() => {
    if (!prescription) return [];
    return prescription.highlightedIndices
      .map((i) => primarySessions[i])
      .filter((s): s is { n: number; title: string; tag: string } => Boolean(s));
  }, [prescription, primarySessions]);

  const alternativeCourses = useMemo(
    () =>
      prescription
        ? (prescription.alternatives
            .map((s) => courseByslug(s))
            .filter(Boolean) as NonNullable<ReturnType<typeof courseByslug>>[])
        : [],
    [prescription]
  );

  const whatsappHref = useMemo(() => {
    if (!identity || !ambition || !primaryCourse) return siteConfig.links.whatsapp;
    const msg = [
      `Hi TARAhut! I'm ${name || 'a new student'}.`,
      ``,
      `TARA matched my profile to a custom path:`,
      `· Who I am: ${idLabel(IDENTITY_OPTIONS, identity)}`,
      `· My goal: ${idLabel(AMBITION_OPTIONS, ambition)}`,
      `· Primary course: ${primaryCourse.title}`,
      ``,
      `Please send me my full roadmap PDF and help me book a free demo class for this course.`,
    ].join('\n');
    const digits = siteConfig.contact.phone.replace(/\D/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  }, [identity, ambition, name, primaryCourse]);

  function reset() {
    setStep('identity');
    setIdentity(null);
    setAmbition(null);
    setName('');
    setWhatsapp('');
    setError('');
  }

  return (
    <section
      id="career-architect"
      className="relative overflow-hidden px-4 py-24 sm:py-28"
      style={{ backgroundColor: '#030406' }}
    >
      {/* Emerald aura + lab grid — matches the hero + lab feed so
          the architect reads as part of the same universe. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(16,185,129,0.18) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Eyebrow + title */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
            &gt; Ask TARA · Career Architect
          </p>
          <h2 className="mt-3 font-['Space_Grotesk',sans-serif] text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Let TARA design your AI roadmap
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
            3 quick questions. A custom 16-session path. No generic answers.
          </p>
        </div>

        {/* Frosted-glass card */}
        <div
          className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-white/[0.03] p-6 backdrop-blur-2xl sm:p-10"
          style={{
            boxShadow:
              '0 20px 60px -10px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.18)',
          }}
        >
          {/* Step indicator row */}
          {step !== 'analyzing' && step !== 'result' && (
            <StepIndicator step={step} />
          )}

          <AnimatePresence mode="wait">
            {step === 'identity' && (
              <motion.div
                key="identity"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <StepHeading
                  step="01/03"
                  title="Who are you?"
                  sub="TARA will customize the 16-session journey based on your professional background."
                />
                <OptionGrid>
                  {IDENTITY_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      icon={opt.icon}
                      label={opt.label}
                      sub={opt.sub}
                      selected={identity === opt.id}
                      onClick={() => setIdentity(opt.id)}
                    />
                  ))}
                </OptionGrid>
                <PrimaryContinue
                  disabled={!identity}
                  label="Continue →"
                  onClick={() => setStep('ambition')}
                />
              </motion.div>
            )}

            {step === 'ambition' && (
              <motion.div
                key="ambition"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <StepHeading
                  step="02/03"
                  title="What is your primary goal?"
                  sub="Select what you want AI to do for you in the next 30 days."
                />
                <OptionGrid>
                  {AMBITION_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.id}
                      icon={opt.icon}
                      label={opt.label}
                      sub={opt.sub}
                      selected={ambition === opt.id}
                      onClick={() => setAmbition(opt.id)}
                    />
                  ))}
                </OptionGrid>
                <PrimaryContinue
                  disabled={!ambition}
                  label="Analyze my career path →"
                  onClick={() => setStep('contact')}
                />
                <BackLink onBack={() => setStep('identity')} />
              </motion.div>
            )}

            {step === 'contact' && (
              <motion.form
                key="contact"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                onSubmit={handleContactSubmit}
                noValidate
              >
                <StepHeading
                  step="Final step"
                  title="Where should TARA send your roadmap?"
                  sub="Your WhatsApp is the key — it unlocks the custom PDF and your free Session 1."
                />

                <div className="mt-2 flex flex-col gap-4">
                  <Input
                    label="Your name"
                    value={name}
                    onChange={setName}
                    placeholder="Parveen Singh"
                    autoFocus
                  />
                  <Input
                    label="WhatsApp number"
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder="+91 9200 882 008"
                    type="tel"
                    inputMode="tel"
                  />
                  {error && (
                    <p className="text-sm font-semibold text-red-400">{error}</p>
                  )}
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('ambition')}
                    className="text-sm font-semibold text-[#94a3b8] transition-colors hover:text-emerald-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-emerald-500 px-8 text-sm font-extrabold text-white shadow-[0_0_22px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.8)] sm:text-base"
                  >
                    Unlock my roadmap →
                  </button>
                </div>
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]/70 sm:text-right">
                  Private · No spam · WhatsApp-first
                </p>
              </motion.form>
            )}

            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <TaraOrb />
                <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                  &gt; TARA is analyzing
                </p>
                <h3 className="mt-3 font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white sm:text-3xl">
                  {name ? `One moment, ${name.split(' ')[0]}…` : 'One moment…'}
                </h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]"
                  >
                    {ANALYSIS_STATUSES[statusIndex]}
                  </motion.p>
                </AnimatePresence>
                <ProgressDots />
              </motion.div>
            )}

            {step === 'result' && identity && ambition && prescription && primaryCourse && (
              <motion.div
                key="result"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <RoadmapBlueprint
                  name={name}
                  identityLabel={idLabel(IDENTITY_OPTIONS, identity)}
                  ambitionLabel={idLabel(AMBITION_OPTIONS, ambition)}
                  primaryCourse={primaryCourse}
                  highlightedSessions={highlightedSessions}
                  pitch={prescription.pitch}
                  alternativeCourses={alternativeCourses}
                  whatsappHref={whatsappHref}
                  onReset={reset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const order: Step[] = ['identity', 'ambition', 'contact'];
  const active = order.indexOf(step);
  return (
    <div className="mb-6 flex items-center gap-2">
      {order.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <span
            className={`flex size-6 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-colors ${
              i <= active
                ? 'bg-emerald-500 text-black'
                : 'bg-white/[0.05] text-[#94a3b8]'
            }`}
          >
            {i + 1}
          </span>
          {i < order.length - 1 && (
            <span
              className={`h-px flex-1 transition-colors ${
                i < active ? 'bg-emerald-500' : 'bg-white/[0.08]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepHeading({ step, title, sub }: { step: string; title: string; sub: string }) {
  // `step` can be "01/03" or "Final step" — both render the same way.
  const label = step.toLowerCase().startsWith('final') ? step : `Step ${step}`;
  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
        &gt; {label}
      </p>
      <h3 className="mt-2 font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-tight text-white sm:text-3xl">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#94a3b8] sm:text-base">{sub}</p>
    </div>
  );
}

function PrimaryContinue({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-500 px-6 text-sm font-extrabold text-white shadow-[0_0_22px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.8)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-emerald-500 disabled:hover:shadow-[0_0_22px_rgba(16,185,129,0.5)] sm:text-base"
    >
      {label}
    </button>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function OptionButton({
  icon,
  label,
  sub,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex min-h-[68px] items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 sm:p-5 ${
        selected
          ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)]'
          : 'border-white/10 bg-white/[0.03] hover:border-emerald-400/55 hover:bg-emerald-500/[0.08] hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]'
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-2xl transition-colors ${
          selected ? 'bg-emerald-500/30' : 'bg-white/[0.05] group-hover:bg-emerald-500/15'
        }`}
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span
          className={`font-['Space_Grotesk',sans-serif] text-base font-bold sm:text-lg ${
            selected ? 'text-white' : 'text-white'
          }`}
        >
          {label}
        </span>
        <span
          className={`text-xs sm:text-sm ${
            selected ? 'text-emerald-100' : 'text-[#94a3b8]'
          }`}
        >
          {sub}
        </span>
      </span>
      {selected ? (
        <span
          aria-hidden
          className="ml-auto flex size-6 items-center justify-center rounded-full bg-emerald-400 text-black"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span
          aria-hidden
          className="ml-auto text-xl text-emerald-400/50 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-300"
        >
          →
        </span>
      )}
    </button>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mt-6 text-sm font-semibold text-[#94a3b8] transition-colors hover:text-emerald-300"
    >
      ← Back
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: 'tel' | 'text' | 'email';
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
        {label}
      </span>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="block h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-base text-white placeholder:text-white/30 transition-colors focus:border-emerald-400/60 focus:bg-emerald-500/[0.04] focus:outline-none"
      />
    </label>
  );
}

function TaraOrb() {
  return (
    <div className="relative">
      <motion.span
        aria-hidden
        className="absolute -inset-8 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.55) 0%, rgba(16,185,129,0.15) 45%, transparent 75%)',
          filter: 'blur(18px)',
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_0_40px_rgba(16,185,129,0.7)] ring-2 ring-emerald-300/40"
        animate={{
          borderRadius: [
            '62% 38% 36% 64% / 55% 44% 56% 45%',
            '44% 56% 60% 40% / 66% 34% 58% 42%',
            '54% 46% 44% 56% / 38% 62% 35% 65%',
            '62% 38% 36% 64% / 55% 44% 56% 45%',
          ],
          scale: [1, 1.05, 1],
        }}
        transition={{
          borderRadius: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <span className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-white drop-shadow-sm">
          T
        </span>
      </motion.div>
    </div>
  );
}

function ProgressDots() {
  return (
    <div className="mt-4 flex gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-2 animate-bounce rounded-full bg-emerald-400"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function RoadmapBlueprint({
  name,
  identityLabel,
  ambitionLabel,
  primaryCourse,
  highlightedSessions,
  pitch,
  alternativeCourses,
  whatsappHref,
  onReset,
}: {
  name: string;
  identityLabel: string;
  ambitionLabel: string;
  primaryCourse: NonNullable<ReturnType<typeof courseByslug>>;
  highlightedSessions: { n: number; title: string; tag: string }[];
  pitch: string;
  alternativeCourses: NonNullable<ReturnType<typeof courseByslug>>[];
  whatsappHref: string;
  onReset: () => void;
}) {
  const totalSessions = primaryCourse.syllabus.reduce(
    (n, m) => n + m.topics.length,
    0
  );
  return (
    <div>
      {/* Certificate header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
          &gt; Roadmap · TARAhut AI Labs
        </p>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94a3b8] transition-colors hover:text-emerald-300"
        >
          ⟲ Reset
        </button>
      </div>

      <h3 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold leading-tight text-white sm:text-4xl">
        {name ? `${name}'s AI Path` : 'Your AI Path'}
      </h3>
      <p className="mt-2 text-sm text-[#94a3b8] sm:text-base">
        Identity: <span className="text-emerald-300">{identityLabel}</span>
        <span className="mx-2 text-white/20">·</span>
        Goal: <span className="text-emerald-300">{ambitionLabel}</span>
      </p>

      {/* Primary course — the buy decision. Big emerald card with
          course meta, pitch line, and 3 highlighted sessions pulled
          from this course's real syllabus. */}
      <Link
        href={`/courses/${primaryCourse.slug}#syllabus`}
        className="mt-7 block overflow-hidden rounded-2xl border border-emerald-400/40 bg-emerald-500/[0.08] p-5 transition-all hover:border-emerald-300/70 hover:bg-emerald-500/[0.12] hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.55)] sm:p-6"
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
          &gt; Primary track · designed for you
        </p>
        <h4 className="mt-2 font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-tight text-white sm:text-3xl">
          {primaryCourse.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
          {pitch}
        </p>

        {/* Meta row — duration, level, sessions, price */}
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.16em]">
          <span className="rounded-md border border-emerald-400/30 bg-black/30 px-2 py-0.5 text-emerald-300">
            {primaryCourse.duration}
          </span>
          <span className="rounded-md border border-emerald-400/30 bg-black/30 px-2 py-0.5 text-emerald-300">
            {primaryCourse.level}
          </span>
          <span className="rounded-md border border-emerald-400/30 bg-black/30 px-2 py-0.5 text-emerald-300">
            {totalSessions} sessions
          </span>
          <span className="rounded-md border border-emerald-400/30 bg-black/30 px-2 py-0.5 text-emerald-300">
            ₹{primaryCourse.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Highlighted sessions from THIS course's real syllabus */}
        <div className="mt-5 border-t border-emerald-500/20 pt-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400/90">
            &gt; Start here · 3 sessions from this track
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {highlightedSessions.map((s) => (
              <li
                key={s.n}
                className="flex items-start gap-3 rounded-lg border border-emerald-400/15 bg-black/35 p-3 sm:items-center sm:gap-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black/70 font-mono text-sm font-extrabold text-emerald-300 shadow-[inset_0_0_10px_rgba(16,185,129,0.35)] sm:size-12 sm:text-base">
                  {String(s.n).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-['Space_Grotesk',sans-serif] text-sm font-bold leading-snug text-white sm:text-base">
                    {s.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-300/80 sm:text-[10px]">
                    {s.tag}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Link>

      {/* Alternative tracks — two adjacent paths. Smaller cards, same
          clickable pattern. Frames "if the primary isn't the fit". */}
      {alternativeCourses.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#94a3b8]">
            &gt; Also worth considering
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {alternativeCourses.map((alt) => {
              const altTotal = alt.syllabus.reduce(
                (n, m) => n + m.topics.length,
                0
              );
              return (
                <Link
                  key={alt.slug}
                  href={`/courses/${alt.slug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-500/[0.06]"
                >
                  <p className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-white group-hover:text-emerald-200 sm:text-base">
                    {alt.title}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#94a3b8]">
                    {alt.duration} · {altTotal} sessions · ₹{alt.price.toLocaleString('en-IN')}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-[#94a3b8] line-clamp-2">
                    {alt.shortDescription}
                  </p>
                  <span
                    aria-hidden
                    className="mt-1 text-xs text-emerald-400 transition-transform group-hover:translate-x-0.5"
                  >
                    Explore →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTAs — primary WhatsApp closer, secondary link to full
          primary syllabus, tertiary restart. */}
      <div className="mt-7 flex flex-col gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_44px_rgba(16,185,129,0.85)] sm:text-base"
        >
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          Download My Roadmap PDF &amp; Book Free Demo
        </a>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${primaryCourse.slug}#syllabus`}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-gray-200 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white sm:text-base"
          >
            See full {totalSessions}-session syllabus
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/10 px-6 text-sm font-semibold text-[#94a3b8] transition-colors hover:border-emerald-400/40 hover:text-emerald-300 sm:text-base"
          >
            ⟲ Start new roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
