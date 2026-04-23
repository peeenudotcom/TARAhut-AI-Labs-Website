'use client';

import { useMemo, useState } from 'react';
import { siteConfig } from '@/config/site';

// Live AI Playground — the "Mini-Lab" inserted into the Pulse Path
// next to the prompt-engineering session on AI Tools Mastery. Users
// type a basic task, click "Apply TARA Logic", and see a split-view
// of Standard vs TARAhut-Master output. The Master result demonstrates
// the framework taught in Week 1 (PAS, CRISP, persona injection,
// outcome-first phrasing) so the widget doubles as a teaser.

type ExampleId = 'sales-email' | 'instagram' | 'cold-whatsapp' | 'product-desc';

interface Example {
  id: ExampleId;
  label: string;
  starter: string; // pre-fills the textarea on click
  framework: string; // shown as the Master tag
  standard: string;
  master: string;
}

const EXAMPLES: Example[] = [
  {
    id: 'sales-email',
    label: 'Sales email',
    starter: 'Write a sales email for my AI training course',
    framework: 'PAS framework + persona injection',
    standard:
      'Hi there,\nWe offer an AI training course. It covers ChatGPT, Claude, and Canva AI. The price is ₹4,999. Limited seats available, please reply to enrol.\nThanks,\nTARAhut',
    master:
      'Hi {{name}},\n\nYou\'ve probably tried 5 different AI tutorials this month and still feel like you\'re scratching the surface. Most courses dump theory and call it training.\n\nWe built TARAhut differently — 16 hands-on sessions, one real project per week, and a portfolio you can show clients by Friday of Sprint 02.\n\nWant to see Session 1 free? Reply with "yes" and I\'ll send the link.\n\nParveen',
  },
  {
    id: 'instagram',
    label: 'Instagram post',
    starter: 'Write an Instagram caption for a Punjabi boutique\'s new lehenga collection',
    framework: 'CRISP framework + 3-second hook',
    standard:
      'Check out our new lehenga collection! Available in 5 colours. DM us for price. #fashion #lehenga #punjabi #boutique #newcollection',
    master:
      'Bhabhi ne kya kaha jab dekhi ye? 👀\n\nNew lehenga drop — emerald + saffron, hand-stitched in Patiala, every piece numbered (only 12 made of each).\n\n💌 DM the colour you want before Saturday — after that, no re-runs.\n\n📍 Try-on slot at the boutique: link in bio',
  },
  {
    id: 'cold-whatsapp',
    label: 'Cold WhatsApp',
    starter: 'Write a cold WhatsApp to a property buyer',
    framework: 'Curiosity gap + 1-line social proof + single ask',
    standard:
      'Hi sir, I have a 3 BHK property for sale in Kotkapura. Price is ₹65 lakh. Please call to discuss.',
    master:
      'Sat sri akal — quick one. You looked at the Mehta Chowk plot last month. The owner just dropped the price by ₹4 lakh (3rd buyer pulled out, he wants to close this week).\n\nWorth a 5-min call before another buyer locks it? Free at 6pm today.',
  },
  {
    id: 'product-desc',
    label: 'Product description',
    starter: 'Write a product description for a Punjab-made hair oil',
    framework: 'Outcome-first + sensory language + pain addressed',
    standard:
      'Our hair oil is made with natural ingredients including amla, bhringraj, and coconut oil. It nourishes the hair and reduces hair fall. 100ml bottle. Buy now.',
    master:
      'Strong roots, in 21 nights.\n\nHand-pressed in Faridkot. Cold-extracted amla + bhringraj steeped in Kashmiri coconut for 90 days — the way your dadi did it before bottles came in.\n\nWhat you\'ll feel by Day 21:\n· Less hair on the comb\n· Scalp tingles in the first 5 minutes\n· Roots feel anchored, not greasy\n\n100ml. Made for thinning hair after 30. ₹449.',
  },
];

type Phase = 'idle' | 'pulsing' | 'revealed';

export function AIPlayground() {
  const [activeId, setActiveId] = useState<ExampleId>('sales-email');
  const [input, setInput] = useState(EXAMPLES[0].starter);
  const [phase, setPhase] = useState<Phase>('idle');

  const example = useMemo(
    () => EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0],
    [activeId]
  );

  function handleApply() {
    if (phase === 'pulsing') return;
    setPhase('pulsing');
    // Pulse the input border for ~500ms ("TARA processing"), then
    // reveal the comparison with the wipe animation.
    window.setTimeout(() => setPhase('revealed'), 520);
  }

  function pickExample(id: ExampleId) {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setActiveId(id);
    setInput(ex.starter);
    setPhase('idle');
  }

  function reset() {
    setPhase('idle');
  }

  const whatsappHref = useMemo(() => {
    const digits = siteConfig.contact.phone.replace(/\D/g, '');
    const msg =
      'Hi TARA! I tried the Live AI Playground on the AI Tools Mastery page. I want the full prompt engineering framework — Week 1 syllabus + how to enrol.';
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  }, []);

  return (
    <div className="relative my-10 sm:my-12">
      {/* Anchor pill — signals this widget belongs to a session */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
        </span>
        Try the Mini-Lab · Live
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#030406]/95 p-5 backdrop-blur-xl sm:p-7"
        style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6), 0 0 30px rgba(16,185,129,0.12)' }}
      >
        {/* Lab grid background — keeps it part of the same universe */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          }}
        />

        <div className="relative">
          {/* Heading row */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                &gt; Live AI Playground
              </p>
              <h4 className="mt-1.5 font-['Space_Grotesk',sans-serif] text-lg font-bold text-white sm:text-xl">
                See the difference a framework makes
              </h4>
              <p className="mt-1 text-xs text-[#94a3b8] sm:text-sm">
                Type a basic task. We&apos;ll run it through ChatGPT raw vs the framework you learn in Week 1.
              </p>
            </div>
          </div>

          {/* Example chips */}
          <div className="mb-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => pickExample(ex.id)}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-all ${
                  activeId === ex.id
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-emerald-400/40 hover:bg-emerald-500/[0.08] hover:text-emerald-200'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Input + Apply button */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (phase === 'revealed') setPhase('idle');
              }}
              placeholder="Type a basic task (e.g., Write a sales email)…"
              rows={3}
              className={`block w-full resize-none rounded-xl border bg-black/80 p-4 pr-32 font-mono text-[13px] leading-relaxed text-white/90 placeholder:text-white/30 outline-none transition-colors ${
                phase === 'pulsing'
                  ? 'border-emerald-400 [animation:tara-input-pulse_0.5s_ease-in-out_infinite]'
                  : 'border-white/15 focus:border-emerald-400/60 focus:bg-black'
              }`}
              style={{ fontFamily: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace' }}
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={phase === 'pulsing' || !input.trim()}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-extrabold text-white shadow-[0_0_18px_rgba(16,185,129,0.45)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.7)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {phase === 'pulsing' ? (
                <>
                  <svg className="size-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <circle cx="12" cy="12" r="10" opacity={0.25} />
                    <path d="M22 12a10 10 0 01-10 10" strokeLinecap="round" />
                  </svg>
                  Processing
                </>
              ) : phase === 'revealed' ? (
                <>Re-run ✨</>
              ) : (
                <>Apply TARA Logic ✨</>
              )}
            </button>
            <style>{`
              @keyframes tara-input-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.55); }
                50%      { box-shadow: 0 0 0 4px rgba(16,185,129,0.15); }
              }
              @keyframes tara-wipe {
                from { clip-path: inset(0 100% 0 0); }
                to   { clip-path: inset(0 0 0 0); }
              }
            `}</style>
          </div>

          {/* Result panel */}
          {phase === 'revealed' && (
            <div
              key={`${activeId}-${phase}`}
              className="mt-5"
              style={{ animation: 'tara-wipe 0.7s cubic-bezier(0.19, 1, 0.22, 1) both' }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Standard result — slate gray, low contrast */}
                <ResultPanel
                  tag="Standard Result"
                  tagSub="ChatGPT, no framework"
                  body={example.standard}
                  variant="standard"
                />
                {/* Master result — high contrast emerald.
                    On mobile this comes BELOW the standard but with
                    a glowing border + scale so it still wins the eye. */}
                <ResultPanel
                  tag="TARAhut Master"
                  tagSub={example.framework}
                  body={example.master}
                  variant="master"
                />
              </div>

              {/* Footer CTA */}
              <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] px-4 py-3 sm:flex-row">
                <p className="text-center text-xs text-white/85 sm:text-left sm:text-sm">
                  This logic is taught in <span className="font-bold text-emerald-300">Week 1</span> — the full framework + 25-prompt vault is yours after enrolling.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-extrabold text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.8)]"
                >
                  WhatsApp for full framework →
                </a>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-3 w-full text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#94a3b8] transition-colors hover:text-emerald-300"
              >
                ⟲ Try another task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  tag,
  tagSub,
  body,
  variant,
}: {
  tag: string;
  tagSub: string;
  body: string;
  variant: 'standard' | 'master';
}) {
  const isMaster = variant === 'master';
  return (
    <article
      className={`relative flex flex-col gap-3 rounded-xl border p-4 ${
        isMaster
          ? 'border-emerald-400/55 bg-emerald-500/[0.06] shadow-[0_8px_30px_-10px_rgba(16,185,129,0.4),inset_0_0_1px_rgba(16,185,129,0.6)] order-first sm:order-last'
          : 'border-white/[0.08] bg-white/[0.02]'
      }`}
    >
      <header className="flex items-baseline justify-between gap-2">
        <span
          className={`font-mono text-[9px] font-extrabold uppercase tracking-[0.22em] ${
            isMaster ? 'text-emerald-300' : 'text-[#475569]'
          }`}
        >
          {tag}
        </span>
        {isMaster && (
          <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-300/80">
            <span className="size-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            Master
          </span>
        )}
      </header>
      <p
        className={`whitespace-pre-line text-[12.5px] leading-relaxed sm:text-[13px] ${
          isMaster ? 'text-white' : 'text-[#94a3b8]'
        }`}
        style={isMaster ? { fontFamily: 'inherit' } : { fontFamily: 'inherit' }}
      >
        {body}
      </p>
      <p
        className={`mt-auto font-mono text-[9px] uppercase tracking-[0.16em] ${
          isMaster ? 'text-emerald-300/70' : 'text-[#475569]'
        }`}
      >
        {tagSub}
      </p>
    </article>
  );
}
