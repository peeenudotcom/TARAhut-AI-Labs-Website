'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PROMPT_CATEGORIES,
  promptVault,
  type PromptCategory,
  type PromptEntry,
} from '@/config/prompt-vault';
import { siteConfig } from '@/config/site';

// The Emerald Prompt Vault — searchable, categorized library of
// production prompts. Click a card to open an interactive preview
// with the full prompt, TARA's tip on why it works, copy-to-clipboard,
// and a nudge back into the AI Tools Mastery syllabus.

type FilterCategory = PromptCategory | 'all';

export function PromptVault() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PromptEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return promptVault.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.prompt,
        p.taraTip,
        p.sessionTitle,
        ...(p.tags ?? []),
        ...p.tools,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: promptVault.length };
    promptVault.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1;
    });
    return c;
  }, []);

  return (
    <section className="relative px-4 py-24 sm:py-28" style={{ backgroundColor: '#030406' }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 65%)',
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
            'radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
            &gt; Free Tool · Daily Utility
          </p>
          <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            The <span className="text-emerald-400">Emerald Prompt Vault</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
            Production prompts for Punjab&apos;s real workflows — legal notices, realtor
            reels, dhaba menus, mandi reports. Copy, paste, ship. Every prompt links
            back to the session that teaches the logic.
          </p>
        </div>

        {/* Search + category pills */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts — try 'legal', 'reels', 'dhaba', 'mandi'…"
              className="block h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white placeholder:text-white/35 transition-colors focus:border-emerald-400/60 focus:bg-emerald-500/[0.04] focus:outline-none sm:text-base"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <PillButton
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              count={counts.all}
              icon="✦"
              label="All"
            />
            {PROMPT_CATEGORIES.map((c) => (
              <PillButton
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
                count={counts[c.id] ?? 0}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-white/40">
              &gt; No prompts match &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PromptCard key={p.id} prompt={p} onOpen={() => setSelected(p)} />
            ))}
          </div>
        )}

        {/* Submit your own — community loop */}
        <div className="mt-14 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-6 text-center sm:p-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            &gt; Community Submissions
          </p>
          <h3 className="mt-2 font-['Space_Grotesk',sans-serif] text-xl font-bold text-white sm:text-2xl">
            Got a prompt that earned you money?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#94a3b8]">
            Send it to TARA. If approved, your prompt joins the vault and your project
            gets featured in the Live Lab — with credit.
          </p>
          <a
            href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi TARA! I want to submit a prompt to the Emerald Prompt Vault. Here it is:\n\n[paste prompt]\n\nCategory: [legal/real-estate/retail/content/automation/agriculture]\nWhat it does: [one line]')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-bold text-white shadow-[0_0_22px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_0_36px_rgba(16,185,129,0.8)]"
          >
            Submit via WhatsApp →
          </a>
        </div>
      </div>

      {/* Interactive preview modal */}
      <AnimatePresence>
        {selected && (
          <PromptPreviewModal
            prompt={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────

function PillButton({
  active,
  onClick,
  count,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
        active
          ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
          : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-emerald-400/40 hover:bg-emerald-500/[0.08] hover:text-emerald-200'
      }`}
    >
      <span aria-hidden>{icon}</span>
      {label}
      <span
        className={`font-mono text-[10px] tracking-widest ${
          active ? 'text-emerald-300' : 'text-white/40'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function PromptCard({ prompt, onOpen }: { prompt: PromptEntry; onOpen: () => void }) {
  const category = PROMPT_CATEGORIES.find((c) => c.id === prompt.category);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all hover:-translate-y-1 hover:border-emerald-400/55 hover:bg-emerald-500/[0.06] hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
          <span aria-hidden>{category?.icon}</span>
          {category?.label}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
          Session {String(prompt.sessionNumber).padStart(2, '0')}
        </span>
      </div>
      <h3 className="font-['Space_Grotesk',sans-serif] text-base font-bold leading-tight text-white group-hover:text-emerald-100 sm:text-lg">
        {prompt.title}
      </h3>
      <p className="line-clamp-3 font-mono text-[11px] leading-relaxed text-white/55">
        {prompt.prompt.replace(/\{\{([^}]+)\}\}/g, '…').slice(0, 140)}…
      </p>
      <div className="mt-auto flex w-full items-center justify-between text-xs">
        <span className="font-mono uppercase tracking-widest text-emerald-300/70">
          {prompt.tools.slice(0, 2).join(' · ')}
        </span>
        <span
          aria-hidden
          className="text-emerald-400 transition-transform group-hover:translate-x-0.5"
        >
          Open →
        </span>
      </div>
    </button>
  );
}

function PromptPreviewModal({
  prompt,
  onClose,
}: {
  prompt: PromptEntry;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const category = PROMPT_CATEGORIES.find((c) => c.id === prompt.category);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can fail in insecure contexts; silent fail — user
      // can still select + copy manually from the <pre>.
    }
  }

  // Highlight {{VARIABLE}} placeholders in the prompt text so users
  // instantly see what they need to swap.
  const promptWithHighlights = useMemo(() => {
    const parts: React.ReactNode[] = [];
    const regex = /(\{\{[^}]+\}\})/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(prompt.prompt)) !== null) {
      if (match.index > lastIndex) {
        parts.push(prompt.prompt.slice(lastIndex, match.index));
      }
      parts.push(
        <span
          key={match.index}
          className="rounded bg-emerald-500/25 px-1 font-bold text-emerald-200"
        >
          {match[1]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < prompt.prompt.length) {
      parts.push(prompt.prompt.slice(lastIndex));
    }
    return parts;
  }, [prompt.prompt]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/70 px-4 pb-4 pt-8 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#030406] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.25)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] bg-emerald-500/[0.04] px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                <span aria-hidden>{category?.icon}</span>
                {category?.label}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                {prompt.tools.join(' · ')}
              </span>
            </div>
            <h3 className="mt-2 font-['Space_Grotesk',sans-serif] text-xl font-bold leading-tight text-white sm:text-2xl">
              {prompt.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {/* TARA Tip */}
          <div className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
              &gt; TARA Tip · Why this works
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {prompt.taraTip}
            </p>
          </div>

          {/* The prompt itself */}
          <div className="relative">
            <pre className="whitespace-pre-wrap break-words rounded-xl border border-white/[0.08] bg-black/40 p-4 font-mono text-[12px] leading-relaxed text-white/90">
              {promptWithHighlights}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-all ${
                copied
                  ? 'border-emerald-400 bg-emerald-500 text-black'
                  : 'border-emerald-400/40 bg-black/60 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200'
              }`}
            >
              {copied ? (
                <>
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Highlighted values (
            <span className="text-emerald-300">&#123;&#123;LIKE_THIS&#125;&#125;</span>
            ) are placeholders — swap them before running.
          </p>

          {/* Session nudge */}
          <Link
            href={`/courses/ai-tools-mastery-beginners#syllabus`}
            className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/25 bg-black/30 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-emerald-500/[0.06]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 font-mono text-base font-extrabold text-emerald-300 shadow-[inset_0_0_10px_rgba(16,185,129,0.35)]">
              {String(prompt.sessionNumber).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-400/80">
                &gt; From the course
              </p>
              <p className="mt-0.5 font-['Space_Grotesk',sans-serif] text-sm font-bold text-white">
                Session {prompt.sessionNumber} · {prompt.sessionTitle}
              </p>
              <p className="mt-0.5 text-xs text-[#94a3b8]">
                Master the logic behind this prompt — not just this one, but every variant.
              </p>
            </div>
            <span aria-hidden className="text-emerald-400">
              →
            </span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
