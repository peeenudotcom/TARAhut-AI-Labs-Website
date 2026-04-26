'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { marked } from 'marked';
import type { PlaygroundTask, PlaygroundAction } from '@/config/learn-modules';

const PROMPT_MAX = 1000;

// Render Claude's markdown output to HTML. We trust Claude here — same risk
// posture as the existing /blog markdown render. If we ever feed user-authored
// content to this path, swap to DOMPurify-sanitised output.
function renderMarkdown(text: string): string {
  if (!text) return '';
  return marked.parse(text, { breaks: true, async: false }) as string;
}

interface OutputSection {
  title: string | null; // null = intro/lead chunk before the first ## heading
  body: string;         // markdown source
}

// Split a markdown response on `## ` headings so we can render each chunk as
// its own visual card. Streaming-friendly: works on partial text — new cards
// pop in as `## Week N` headings stream in.
function parseSections(text: string): OutputSection[] {
  if (!text) return [];
  if (!/^## /m.test(text)) return [{ title: null, body: text }];
  const parts = text.split(/^## /m);
  const sections: OutputSection[] = [];
  if (parts[0].trim()) sections.push({ title: null, body: parts[0].trim() });
  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = (lines[0] || '').trim();
    const body = lines.slice(1).join('\n').trim();
    sections.push({ title, body });
  }
  return sections;
}

interface SavedArtifact {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

interface Props {
  sessionNumber: number;
  sessionTitle: string;
  sessionDescription: string;
  courseId: string;
  task: PlaygroundTask;
  initialRemaining: number;
  dailyCap: number;
  latestArtifact: SavedArtifact | null;
  isAuthenticated: boolean;
}

type Phase = 'idle' | 'streaming' | 'done' | 'error';

export function PlaygroundApp({
  sessionNumber,
  sessionTitle,
  sessionDescription,
  courseId,
  task,
  initialRemaining,
  dailyCap,
  latestArtifact,
  isAuthenticated,
}: Props) {
  const [prompt, setPrompt] = useState(task.starterPrompt);
  const [response, setResponse] = useState(latestArtifact?.response ?? '');
  const [phase, setPhase] = useState<Phase>(latestArtifact ? 'done' : 'idle');
  const [error, setError] = useState<string | null>(null);
  // Differentiates the 429 ANON_LIMIT case (which gets the rich purple
  // upsell card) from generic errors (which get the red banner).
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(initialRemaining);
  // The artifact shown in the bottom strip. Starts with the server-fetched
  // latest (so returning students immediately see their saved work) and
  // updates after each new generation+save.
  const [savedArtifact, setSavedArtifact] = useState<SavedArtifact | null>(latestArtifact);
  // True once the user has explicitly hit "Save This" on the current
  // generation (or has a previously saved artifact). Drives the green
  // sidebar badge + bottom strip visibility.
  const [hasSavedFirst, setHasSavedFirst] = useState(!!latestArtifact);
  // Tracks whether the current on-screen response has been "kept" by the
  // user. Auto-resets to false when they regenerate.
  const [currentSaved, setCurrentSaved] = useState(!!latestArtifact);
  const [copied, setCopied] = useState(false);
  // Show the "X / N generations used" badge ONLY after the first attempt —
  // hides cost-anxiety upfront and lets the user feel curiosity, not pressure.
  const [hasGenerated, setHasGenerated] = useState(!!latestArtifact);
  // Stream timing → drives the "created in 4.2s" subhead on the value frame.
  const generateStartRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number | null>(null);
  // Brief feedback flash on action button clicks (copy/whatsapp/email).
  const [actionFlash, setActionFlash] = useState<string | null>(null);
  // Multi-select reflection chips (e.g. "what did your AI assistant fix?").
  // Local UI only — clicking toggles, no backend save.
  const [reflectionPicks, setReflectionPicks] = useState<Set<string>>(new Set());
  // Commitment loop — fires after the first SEND-type real-world action
  // (excludes copy + continue-session). Asks "did you actually send it?"
  // and locks in identity on Yes / nudges on Not-yet.
  const [hasTriggeredSendAction, setHasTriggeredSendAction] = useState(false);
  const [sendCommitChoice, setSendCommitChoice] = useState<'yes' | 'not-yet' | null>(null);
  // Intent commit — single tap rehearsal moment that sits BEFORE channel
  // buttons. Converts "I have the line" → "I'm going to use it today".
  const [intentCommitted, setIntentCommitted] = useState(false);

  function toggleReflection(chip: string) {
    setReflectionPicks((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
  }
  // Tracks which Week N section cards the student has committed to. Local
  // only (no backend) — the value is the *commitment moment*, not the data.
  // Reset on regeneration so the user re-commits to the new plan.
  const [startedSections, setStartedSections] = useState<Set<string>>(new Set());
  // Ref for the prompt textarea so "Your Turn" can scroll + focus it after
  // swapping in the bracketed template.
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  // Few-shot examples are rendered as visual cards above the textarea (lifts
  // them out of the prompt so the user isn't drowning in text). When the
  // student clicks Your Turn, examples collapse into the textarea template
  // since they're now editing everything themselves.
  const [examplesActive, setExamplesActive] = useState(!!task.examples);
  const [examplesAllExpanded, setExamplesAllExpanded] = useState(false);

  function toggleStarted(title: string) {
    setStartedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  // "Your Turn" — swap the prompt for a bracketed template the student
  // edits to fit their own business. Resets the playground state so they
  // experience generating their personalised version as a fresh attempt.
  function startYourTurn() {
    if (!task.yourTurnTemplate) return;
    setPrompt(task.yourTurnTemplate);
    setResponse('');
    setPhase('idle');
    setCurrentSaved(false);
    setHasGenerated(false);
    setStartedSections(new Set());
    setError(null);
    setErrorCode(null);
    // Examples cards persist into Your Turn — for few-shot tasks the
    // template should be JUST the items list (with brackets) so the user
    // only edits what's truly new. Examples stay above as the voice anchor.
    // Scroll to + focus the textarea so the next action is unmissable.
    setTimeout(() => {
      promptTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      promptTextareaRef.current?.focus();
    }, 50);
  }

  const responseRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the response card while streaming so new tokens are visible.
  useEffect(() => {
    if (phase === 'streaming' && responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, phase]);

  // Parse the streaming response into visual sections. Cards render
  // distinctly per `## Week N`-style heading — for flat outputs (Session 1's
  // WhatsApp message) we get a single card and the layout collapses cleanly.
  const sections = useMemo(() => parseSections(response), [response]);

  // Build the full prompt sent to the API. If structured examples are active,
  // prepend them so Claude sees the few-shot context — even though the
  // textarea only shows the "items to generate" portion.
  function buildFullPrompt(usePrompt: string): string {
    if (!examplesActive || !task.examples) return usePrompt;
    const exampleBlock = task.examples.items
      .map((ex, i) => `EXAMPLE ${i + 1} — ${ex.label}:\n"${ex.text}"`)
      .join('\n\n');
    return `${task.examples.intro}\n\n${exampleBlock}\n\n${usePrompt}`;
  }

  async function generate(promptOverride?: string) {
    const usePrompt = (promptOverride ?? prompt).trim();
    if (!usePrompt || phase === 'streaming') return;
    if (remaining <= 0) {
      setError(`You've used all ${dailyCap} generations for today. Try again tomorrow.`);
      return;
    }

    setPhase('streaming');
    setResponse('');
    setError(null);
    setErrorCode(null);
    setCurrentSaved(false);
    setElapsedSec(null);
    generateStartRef.current = Date.now();

    try {
      const res = await fetch('/api/learn/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildFullPrompt(usePrompt), session: sessionNumber, course: courseId }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Daily limit reached. Try again tomorrow.');
        setErrorCode(data.code || null);
        setRemaining(0);
        setPhase('error');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        setPhase('error');
        return;
      }

      const remainingHeader = res.headers.get('X-Playground-Remaining');
      if (remainingHeader !== null) setRemaining(Number(remainingHeader));

      if (!res.body) {
        setError('Empty response. Please try again.');
        setPhase('error');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setResponse(acc);
      }
      setPhase('done');
      setHasGenerated(true);
      setElapsedSec((Date.now() - generateStartRef.current) / 1000);
      // Authed users get the celebration immediately — the API already
      // persisted to learn_artifacts on stream finish, so the response IS
      // saved. Surfacing the success state right away matches that truth
      // and removes a redundant "Save This" click.
      if (isAuthenticated) {
        setCurrentSaved(true);
        setHasSavedFirst(true);
        setSavedArtifact({
          id: 'local-' + Date.now(),
          prompt: usePrompt,
          response: acc,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('[playground] generate failed:', err);
      setError('Network error. Check your connection and try again.');
      setPhase('error');
    }
  }

  // One-tap refinement: append the chip's instruction to the existing prompt
  // and re-run. Surfaces the prompt growth so the student SEES how iteration
  // works (great pedagogy for Session 3's prompt-engineering lesson).
  function refineWith(instruction: string) {
    if (phase === 'streaming' || remaining <= 0) return;
    const refined = `${prompt.trim()}\n\nNow apply this change: ${instruction}`;
    setPrompt(refined);
    setStartedSections(new Set());  // re-commit to the refined plan
    void generate(refined);
  }

  // Real-world action handler — closes the reading→doing loop. Each task
  // declares which actions are useful (WhatsApp, copy, email…); we just
  // wire the click. No save happens here; that's done separately.
  async function executeAction(action: PlaygroundAction) {
    const text = response.trim();
    if (!text) return;
    setActionFlash(action.label);
    setTimeout(() => setActionFlash(null), 2200);
    // Trigger the sendCommit prompt only on send-type actions — copy + return-
    // to-session are utility, not "sending". Once triggered, the prompt asks
    // the student to confirm whether they actually sent it.
    if (action.action.type !== 'copy' && action.action.type !== 'continue-session') {
      setHasTriggeredSendAction(true);
    }
    switch (action.action.type) {
      case 'copy': {
        // If sectionMatch is set, copy only the matched section's body
        // instead of the whole response (e.g. "Copy Day 1 post" pulls the
        // Day 1 chunk out of a 7-day calendar).
        let textToCopy = text;
        const sectionMatch = action.action.sectionMatch;
        if (sectionMatch) {
          const matched = parseSections(text).find(
            (s) => s.title?.toLowerCase().startsWith(sectionMatch.toLowerCase())
          );
          if (matched) {
            textToCopy = matched.title ? `## ${matched.title}\n\n${matched.body}` : matched.body;
          }
        }
        try { await navigator.clipboard.writeText(textToCopy); } catch { /* noop */ }
        break;
      }
      case 'whatsapp': {
        const base = action.action.phone
          ? `https://wa.me/${action.action.phone.replace(/\D/g, '')}`
          : 'https://wa.me/';
        // sectionMatch — send ONLY the matched section's body (not the
        // section heading), so chat messages read like real human replies
        // rather than markdown documents. E.g. Session 14's "Your First
        // Reply" section becomes the WhatsApp draft text.
        let messageText = text;
        const sectionMatch = action.action.sectionMatch;
        if (sectionMatch) {
          const matched = parseSections(text).find(
            (s) => s.title?.toLowerCase().startsWith(sectionMatch.toLowerCase())
          );
          if (matched) messageText = matched.body;
        }
        window.open(`${base}?text=${encodeURIComponent(messageText)}`, '_blank', 'noopener');
        break;
      }
      case 'email': {
        const subject = task.outputHeadline ?? `My AI output — Session ${sessionNumber}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
        break;
      }
      case 'continue-session':
        window.location.href = `/learn/session/${sessionNumber}${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`;
        break;
      case 'open-url':
        // Optionally copy the output first so the user can paste straight
        // into the destination tool (e.g. ChatGPT GPT Builder).
        if (action.action.copyFirst) {
          try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
        }
        window.open(action.action.url, '_blank', 'noopener');
        break;
    }
  }

  function saveCurrent() {
    // The API auto-persists every generation to learn_artifacts on stream
    // finish. "Save This" is the user's explicit acknowledgement — it
    // surfaces the bottom strip + sidebar badge and locks this response
    // as the displayed "first AI conversation". The server already has it.
    if (phase !== 'done' || !response.trim()) return;
    setCurrentSaved(true);
    setHasSavedFirst(true);
    setSavedArtifact({
      id: 'local-' + Date.now(),
      prompt: prompt.trim(),
      response,
      created_at: new Date().toISOString(),
    });
  }

  function reset() {
    setPrompt(task.starterPrompt);
  }

  async function copyResponse() {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable */
    }
  }

  const charCount = prompt.length;
  const overLimit = charCount > PROMPT_MAX;

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* ── Lesson breadcrumb row ── */}
      <div className="border-b border-[#1e1e3a] bg-[#0c0c1a]/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/learn/session/${sessionNumber}${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
              className="text-sm font-semibold text-[#059669] hover:underline"
            >
              ← Dashboard
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold text-[#e2e8f0]">
                Session {sessionNumber}: {sessionTitle}
              </p>
              <p className="text-xs text-[#94a3b8]">{sessionDescription}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#94a3b8]">Step 4 of 6</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#1e1e3a]">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#059669] to-[#00f0ff]" />
            </div>
            <span className="text-xs font-semibold text-[#00f0ff]">67%</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr]">
        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-4">
          {/* Task card */}
          <div className="rounded-2xl border border-[#a855f7]/30 bg-gradient-to-br from-[#a855f7]/[0.08] to-[#0c0c1a] p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-[#a855f7]/15 text-lg" aria-hidden>
                🎯
              </span>
              <h2 className="text-base font-bold text-[#a855f7]">{task.taskTitle}</h2>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-[#e2e8f0]">{task.taskDescription}</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#a855f7]">
              <span aria-hidden>🟣</span> {task.timeEstimate}
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-2xl border border-[#00f0ff]/25 bg-[#0c0c1a] p-5">
            <div className="mb-3 flex items-center gap-2">
              <span aria-hidden>📋</span>
              <h3 className="text-sm font-bold text-[#00f0ff]">Instructions</h3>
            </div>
            <ol className="space-y-2 text-sm text-[#e2e8f0]">
              <li className="flex items-start gap-2">
                <span className="text-[#94a3b8]">1.</span>
                <span aria-hidden>✏️</span>
                <span>Enter your prompt (or use default)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#94a3b8]">2.</span>
                <span aria-hidden>⚡</span>
                <span>Click Generate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#94a3b8]">3.</span>
                <span aria-hidden>👁</span>
                <span>Review AI output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#94a3b8]">4.</span>
                <span aria-hidden>✅</span>
                <span>Save your first result</span>
              </li>
            </ol>
          </div>

          {/* Pro Tip */}
          <div className="rounded-2xl border border-[#fbbf24]/25 bg-[#0c0c1a] p-5">
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden>💡</span>
              <h3 className="text-sm font-bold text-[#fbbf24]">Pro Tip</h3>
            </div>
            <p className="mb-3 text-sm text-[#e2e8f0]">Better prompts = better results</p>
            <p className="mb-2 text-xs text-[#94a3b8]">Try adding:</p>
            <div className="flex flex-wrap gap-1.5">
              {task.proTipChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#fbbf24]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* First conversation badge — only after save */}
          {hasSavedFirst && (
            <div className="relative overflow-hidden rounded-2xl border border-[#059669]/40 bg-gradient-to-br from-[#059669]/[0.12] to-[#0c0c1a] p-5">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-[#059669]/10 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <span
                  className="grid size-12 place-items-center rounded-full bg-[#059669]/20 text-2xl shadow-[0_0_24px_rgba(5,150,105,0.5)]"
                  aria-hidden
                >
                  ✓
                </span>
                <div>
                  <p className="text-sm font-bold text-[#10b981]">
                    Your First AI Conversation <span aria-hidden>✓</span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#94a3b8]">{task.outroLine}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN PANEL ── */}
        <main className="flex flex-col gap-6">
          <section className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-5 sm:p-6">
            {/* Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span aria-hidden>🤖</span>
                <h1 className="text-lg font-bold text-[#00f0ff]">AI Playground</h1>
              </div>
              {hasGenerated && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#059669]/30 bg-[#059669]/[0.08] px-3 py-1 text-xs font-semibold text-[#10b981]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#10b981]" />
                  </span>
                  {dailyCap - remaining} / {dailyCap} generations used
                </span>
              )}
            </div>

            {/* Few-shot examples — visual cards above the textarea so the
                student isn't drowning in prompt text. Show N cards by default
                (per task config), rest collapsed behind "View all". Hidden in
                Your Turn mode since the template has everything inline. */}
            {examplesActive && task.examples && (
              <div className="mb-5 rounded-xl border border-[#00f0ff]/20 bg-[#0c0c1a] p-4">
                <p className="mb-3 text-sm leading-relaxed text-[#cbd5e1]">
                  📚 <strong className="text-[#00f0ff]">{task.examples.intro}</strong>
                </p>
                {(() => {
                  const visibleCount = examplesAllExpanded
                    ? task.examples.items.length
                    : task.examples.visibleByDefault ?? 1;
                  const visible = task.examples.items.slice(0, visibleCount);
                  const hidden = task.examples.items.length - visibleCount;
                  return (
                    <>
                      <div className="space-y-2">
                        {visible.map((ex, i) => (
                          <article
                            key={i}
                            className="rounded-lg border border-[#1e1e3a] bg-[#06060e] p-3"
                          >
                            <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00f0ff]">
                              Example {i + 1} — {ex.label}
                            </p>
                            <p className="text-sm italic leading-relaxed text-[#e2e8f0]">
                              &ldquo;{ex.text}&rdquo;
                            </p>
                          </article>
                        ))}
                      </div>
                      {hidden > 0 && (
                        <button
                          type="button"
                          onClick={() => setExamplesAllExpanded(true)}
                          className="mt-3 w-full rounded-lg border border-dashed border-[#00f0ff]/30 px-3 py-2 text-xs font-semibold text-[#00f0ff] transition hover:border-[#00f0ff] hover:bg-[#00f0ff]/[0.05]"
                        >
                          ▼ View {hidden} more example{hidden > 1 ? 's' : ''}
                        </button>
                      )}
                      {examplesAllExpanded && task.examples.items.length > (task.examples.visibleByDefault ?? 1) && (
                        <button
                          type="button"
                          onClick={() => setExamplesAllExpanded(false)}
                          className="mt-3 w-full rounded-lg border border-dashed border-[#1e1e3a] px-3 py-2 text-xs font-semibold text-[#94a3b8] transition hover:text-white"
                        >
                          ▲ Collapse examples
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Prompt */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#00f0ff]">
                  <span aria-hidden>✏️</span> Your Prompt
                </label>
                {/* Reset only appears when the prompt has actually drifted from
                    the starter — avoids the "click does nothing" feeling. */}
                {prompt !== task.starterPrompt && (
                  <button
                    type="button"
                    onClick={reset}
                    title="Restore the original starter prompt"
                    className="text-xs font-semibold text-[#94a3b8] transition hover:text-[#00f0ff]"
                  >
                    ↻ Reset to starter
                  </button>
                )}
              </div>
              <textarea
                ref={promptTextareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_MAX + 200))}
                rows={6}
                className="block w-full resize-y rounded-xl border border-[#1e1e3a] bg-[#06060e] p-4 font-mono text-sm leading-relaxed text-[#e2e8f0] outline-none transition focus:border-[#00f0ff]/50"
                placeholder="Type your prompt here…"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <span aria-hidden>💡</span> Tip: Be specific for better results!
                </p>
                <p className={`text-xs font-mono ${overLimit ? 'text-red-400' : 'text-[#94a3b8]'}`}>
                  {charCount} / {PROMPT_MAX}
                </p>
              </div>
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={() => generate()}
              disabled={phase === 'streaming' || !prompt.trim() || overLimit || remaining <= 0}
              className="mb-5 w-full rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a855f7] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(99,102,241,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(168,85,247,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {phase === 'streaming' ? '⏳ Generating…' : (task.generateButtonLabel ?? '✨ Generate with AI')}
            </button>

            {/* Anon hit the daily cap — show the rich upsell card here
                instead of the generic red error banner so the moment feels
                like an invitation, not an error. Action-framed, not
                save-framed (continue > preserve). */}
            {error && errorCode === 'ANON_LIMIT' && (
              <div className="mb-5 rounded-xl border border-[#a855f7]/40 bg-gradient-to-br from-[#a855f7]/[0.08] to-[#3b82f6]/[0.06] p-5">
                <p className="mb-1.5 text-base font-bold text-[#e2e8f0]">
                  Use this for your own idea →
                </p>
                <p className="mb-4 text-sm leading-relaxed text-[#94a3b8]">
                  Sign in (free) to apply this technique to your own business and continue your AI journey.
                </p>
                <Link
                  href={`/login?next=/learn/session/${sessionNumber}/playground${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                  className="inline-block rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                >
                  Sign in & continue your AI journey →
                </Link>
                <p className="mt-2 text-xs text-[#94a3b8]">Free account · 10 seconds</p>
              </div>
            )}
            {error && errorCode !== 'ANON_LIMIT' && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/[0.08] p-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* Response */}
            {(phase === 'streaming' || phase === 'done' || response) && (
              <div>
                {/* Dynamic value-frame headline — replaces the generic
                    "AI Response" label so the user feels they CREATED
                    something specific, not just got a chatbot reply. */}
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    {phase === 'streaming' ? (
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#00f0ff]">
                        <span aria-hidden>✨</span> Creating {task.outputHeadline ? task.outputHeadline.toLowerCase() : 'your response'}…
                      </label>
                    ) : (
                      <>
                        <label className="flex items-center gap-2 text-sm font-bold text-[#e2e8f0]">
                          <span aria-hidden>🎉</span>
                          {task.outputHeadline ?? 'AI Response'}
                        </label>
                        {elapsedSec !== null && (
                          <span className="font-mono text-xs text-[#94a3b8]">— created in {elapsedSec.toFixed(1)}s</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyResponse}
                      title="Copy raw markdown"
                      className="rounded-md p-1.5 text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                    <button
                      type="button"
                      title="Helpful"
                      className="rounded-md p-1.5 text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white"
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      title="Not helpful"
                      className="rounded-md p-1.5 text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white"
                    >
                      👎
                    </button>
                  </div>
                </div>
                <div
                  ref={responseRef}
                  className="mb-4 max-h-[560px] overflow-auto rounded-xl border border-[#1e1e3a] bg-[#06060e]"
                >
                  {/* Ownership banner — sits ATOP the plan so the user sees
                      this as THEIR document, not just an AI output panel. */}
                  {phase === 'done' && task.outputHeadline && (
                    <div className="sticky top-0 z-10 border-b border-[#00f0ff]/20 bg-gradient-to-r from-[#00f0ff]/[0.10] via-[#a855f7]/[0.06] to-transparent px-5 py-3 backdrop-blur">
                      <p className="text-base font-extrabold leading-tight text-white sm:text-lg">
                        {task.outputHeadline}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3 p-4">
                    {sections.length === 0 && phase === 'streaming' && (
                      <p className="text-sm text-[#94a3b8]">…</p>
                    )}
                    {sections.map((sec, i) => (
                      <SectionCard
                        key={i}
                        title={sec.title}
                        body={sec.body}
                        emphasised={sec.title !== null}
                        started={sec.title ? startedSections.has(sec.title) : false}
                        onToggleStarted={sec.title ? () => toggleStarted(sec.title!) : undefined}
                      />
                    ))}
                    {phase === 'streaming' && (
                      <span className="ml-1 inline-block h-3 w-2 animate-pulse bg-[#00f0ff]" />
                    )}
                  </div>
                </div>

                {/* ── ACTION-FIRST SUCCESS STATE ───────────────────────────
                    Calibration variant for Hustler 45 S1. Strips comparison +
                    why-it-worked + open refinement chips from the main view
                    so the dominant primary action wins the user's attention.
                    Refinement still available behind a "Refine this" toggle —
                    demoted, never removed. Toggled per-session via
                    playgroundTask.successStyle === 'action-first'. */}
                {phase === 'done' && task.successStyle === 'action-first' && (
                  <div className="space-y-5 p-4 sm:p-6">
                    {/* 1 · Success headline — the biggest text on the screen */}
                    <header className="text-center">
                      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#10b981]">
                        ✓ Ready
                      </p>
                      <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                        {task.successHeadline ?? 'Your AI output is ready.'}
                      </h2>
                    </header>

                    {/* 2 · "Use this in" channel chip row */}
                    {task.useThisIn && task.useThisIn.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                          Use this in
                        </span>
                        {task.useThisIn.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#1e1e3a] bg-[#06060e] px-2.5 py-1 text-xs text-[#94a3b8]"
                          >
                            <span aria-hidden>{channelIcon(c)}</span>
                            {channelLabel(c)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 3 · Intent commit — single-tap rehearsal moment */}
                    {task.intentCommit && (
                      <IntentCommitBlock
                        config={task.intentCommit}
                        committed={intentCommitted}
                        onCommit={() => setIntentCommitted(true)}
                      />
                    )}

                    {/* 4 · PRIMARY ACTION — dominant, must out-weigh everything else */}
                    {task.realWorldActions && task.realWorldActions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => executeAction(task.realWorldActions![0])}
                        className="w-full rounded-2xl bg-gradient-to-r from-[#10b981] to-[#059669] px-6 py-5 text-lg font-extrabold text-white shadow-[0_0_36px_rgba(16,185,129,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(16,185,129,0.75)]"
                      >
                        {task.realWorldActions[0].label}
                      </button>
                    )}

                    {/* 5 · Collapsible message preview — content lives behind a tap */}
                    {response && (
                      <details className="group">
                        <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs font-semibold text-[#94a3b8] hover:text-[#cbd5e1] [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">Preview the output ↓</span>
                          <span className="hidden group-open:inline">Hide preview ↑</span>
                        </summary>
                        <div
                          className="prose prose-sm prose-invert mt-3 max-w-none rounded-xl border border-[#1e1e3a] bg-[#06060e]/60 p-4 prose-headings:text-white prose-strong:text-white"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(response) }}
                        />
                      </details>
                    )}

                    {/* 6 · Secondary actions — small, low emphasis, no buttons */}
                    {task.realWorldActions && task.realWorldActions.length > 1 && (
                      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {task.realWorldActions.slice(1).map((act) => (
                          <button
                            key={act.label}
                            type="button"
                            onClick={() => executeAction(act)}
                            className="text-xs font-semibold text-[#94a3b8] underline-offset-2 transition hover:text-white hover:underline"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 7 · Finish line — 3 short beats: stop / start / outcome */}
                    {task.finishLine && (
                      <div className="space-y-1.5 rounded-xl border border-[#1e1e3a] bg-[#06060e]/60 p-4">
                        <p className="text-sm font-bold text-[#cbd5e1]">
                          {task.finishLine.primary}
                        </p>
                        {task.finishLine.microNudge && (
                          <p className="text-xs italic text-[#94a3b8]">
                            {task.finishLine.microNudge}
                          </p>
                        )}
                        {task.finishLine.followThroughNudge && (
                          <p className="border-t border-[#1e1e3a] pt-2 text-xs font-semibold text-[#10b981]">
                            {task.finishLine.followThroughNudge}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 8 · Repeat-loop strip — momentum across days */}
                    {task.repeatLoop && (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#a855f7]/25 bg-[#a855f7]/[0.05] px-4 py-3">
                        <p className="text-xs leading-snug text-[#cbd5e1]">
                          ↻ {task.repeatLoop.tomorrow}
                        </p>
                        {task.repeatLoop.counter && (
                          <span className="rounded-full border border-[#a855f7]/30 bg-[#a855f7]/[0.10] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#a855f7]">
                            {task.repeatLoop.counter}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 9 · Your-Turn nudge — soft identity reinforcement */}
                    {task.yourTurnNudge && (
                      <p className="text-center text-xs italic text-[#94a3b8]">
                        {task.yourTurnNudge}
                      </p>
                    )}

                    {/* 10 · Continue CTA — full-width, ties action to next session */}
                    <Link
                      href={`/learn/session/${sessionNumber + 1}${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                      className="block w-full rounded-2xl bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a855f7] px-6 py-4 text-center text-base font-extrabold text-white shadow-[0_0_24px_rgba(99,102,241,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(168,85,247,0.7)]"
                    >
                      {task.continueButtonLabel ?? `Continue to Session ${sessionNumber + 1} →`}
                    </Link>

                    {/* Send-commit — fires only AFTER the user clicks a send action */}
                    {task.sendCommit && hasTriggeredSendAction && (
                      <SendCommitBlock
                        config={task.sendCommit}
                        choice={sendCommitChoice}
                        onChoose={setSendCommitChoice}
                      />
                    )}

                    {/* Action flash toast */}
                    {actionFlash && (
                      <p className="text-center text-xs font-semibold text-[#10b981]">
                        ✓ {actionFlash} — done
                      </p>
                    )}

                    {/* Refine this — collapsed; never competes with primary */}
                    {task.refinementChips && task.refinementChips.length > 0 && (
                      <details className="group rounded-xl border border-[#1e1e3a] bg-[#06060e]/40 p-3">
                        <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs font-semibold text-[#94a3b8] hover:text-[#cbd5e1] [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">↻ Refine this output (optional) ↓</span>
                          <span className="hidden group-open:inline">↻ Hide refinements ↑</span>
                        </summary>
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {task.refinementChips.map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => refineWith(chip.instruction)}
                              disabled={remaining <= 0 || phase !== 'done'}
                              className="rounded-full border border-[#a855f7]/30 bg-[#a855f7]/[0.06] px-3 py-1.5 text-xs font-semibold text-[#cbd5e1] transition hover:border-[#a855f7] hover:bg-[#a855f7]/[0.15] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* Anon → sign-in nudge at the very bottom (deemphasised) */}
                    {!isAuthenticated && (
                      <div className="rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/[0.04] p-3 text-center">
                        <p className="text-xs text-[#94a3b8]">
                          Sign in (free, 10 sec) to save this plan to your dashboard and unlock 3 generations/day.{' '}
                          <Link
                            href={`/login?next=/learn/session/${sessionNumber}/playground${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                            className="font-bold text-[#a855f7] underline-offset-2 hover:underline"
                          >
                            Sign in →
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {phase === 'done' && task.successStyle !== 'action-first' && (
                  <>
                    {/* Why-it-worked callout — closes the learning loop by
                        making the user understand WHY their structured prompt
                        produced the upgraded output, not just SEE it. Shown
                        only when the task explicitly teaches a technique. */}
                    {task.whyItWorked && (
                      <div className="mb-4 rounded-xl border border-[#a855f7]/30 bg-gradient-to-br from-[#a855f7]/[0.06] to-transparent p-4">
                        <p className="mb-2 text-sm font-bold text-[#a855f7]">
                          ✨ {task.whyItWorked.heading}
                        </p>
                        <ul className="space-y-1.5 text-sm text-[#e2e8f0]">
                          {task.whyItWorked.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-0.5 text-[#a855f7]" aria-hidden>→</span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: renderMarkdown(b).replace(/^<p>|<\/p>\n?$/g, ''),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Before/After comparison — ALWAYS visible side-by-side
                        so the contrast lands without a click. Left column is
                        the lazy/basic version (dim, gray); right column is a
                        snippet of the user's actual structured output (bright,
                        cyan). On mobile they stack. The visceral contrast is
                        the entire point of this teaching moment. */}
                    {task.comparison && (
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                          📊 The visible difference
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* Left — source / lazy / "before" */}
                          <article className="overflow-hidden rounded-xl border border-[#94a3b8]/15 bg-[#06060e]/60 opacity-90">
                            <header className="flex items-baseline justify-between gap-2 border-b border-[#1e1e3a] bg-[#1e1e3a]/30 px-4 py-2">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                                {task.comparison.leftHeader ?? '🔸 Without RCTF'}
                              </span>
                              <span className="text-[10px] text-[#475569]">
                                {task.comparison.leftSubLabel ?? 'Lazy prompt'}
                              </span>
                            </header>
                            <div className="px-4 pt-3 pb-2">
                              <p className="mb-2 italic text-[11px] leading-snug text-[#475569]">
                                &quot;{task.comparison.basicPromptLabel}&quot;
                              </p>
                              <div
                                className="prose prose-sm prose-invert max-w-none text-[#64748b] prose-p:my-1 prose-strong:text-[#94a3b8] prose-li:my-0.5"
                                dangerouslySetInnerHTML={{
                                  __html: renderMarkdown(task.comparison.basicOutput),
                                }}
                              />
                            </div>
                          </article>
                          {/* Right — their actual output snippet */}
                          <article className="overflow-hidden rounded-xl border border-[#10b981]/40 bg-gradient-to-br from-[#10b981]/[0.08] to-[#0c0c1a] shadow-[0_0_18px_-6px_rgba(16,185,129,0.4)]">
                            <header className="flex items-baseline justify-between gap-2 border-b border-[#10b981]/25 bg-[#10b981]/[0.10] px-4 py-2">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#10b981]">
                                {task.comparison.rightHeader ?? '🔹 With YOUR RCTF prompt'}
                              </span>
                              <span className="text-[10px] font-bold text-[#10b981]">
                                {task.comparison.rightSubLabel ?? 'Yours'}
                              </span>
                            </header>
                            <div className="px-4 pt-3 pb-2">
                              <p className="mb-2 italic text-[11px] leading-snug text-[#94a3b8]">
                                Your structured prompt above ↑
                              </p>
                              <div
                                className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-strong:text-white prose-li:my-0.5"
                                dangerouslySetInnerHTML={{
                                  __html: renderMarkdown(truncate(response, 360)),
                                }}
                              />
                              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#10b981]">
                                See full output above ↑
                              </p>
                            </div>
                          </article>
                        </div>
                      </div>
                    )}

                    {/* Your Turn — REQUIRED action positioned right after the
                        comparison so the loop is: see → understand → compare →
                        DO → progress. Loads a bracketed template into the
                        prompt and scrolls/focuses the textarea so the next
                        move is unmissable. Authed students only — anon users
                        see the action-framed upsell card further down. */}
                    {currentSaved && task.yourTurnTemplate && (
                      <div className="mb-4 rounded-2xl border-2 border-dashed border-[#fbbf24]/55 bg-gradient-to-br from-[#fbbf24]/[0.10] to-transparent p-6">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-md bg-[#fbbf24] px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#1e1e3a]">
                            Required
                          </span>
                          <p className="text-base font-extrabold text-[#fbbf24] sm:text-lg">
                            {task.yourTurnHeadline ?? 'Now make it yours'}
                          </p>
                        </div>
                        <p className="mb-4 max-w-xl text-sm leading-relaxed text-[#cbd5e1]">
                          {task.yourTurnBody ?? "You won't learn this by reading. The skill only sticks when you do it for your own context. Click below to load a template, fill in YOUR details, and generate again."}
                        </p>
                        <button
                          type="button"
                          onClick={startYourTurn}
                          className="rounded-xl bg-[#fbbf24] px-6 py-3 text-sm font-extrabold text-[#1e1e3a] shadow-[0_0_20px_rgba(251,191,36,0.45)] transition hover:-translate-y-0.5 hover:bg-[#f59e0b] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)]"
                        >
                          ✏️ Apply this to my own business →
                        </button>
                      </div>
                    )}

                    {/* Refinement chips — one-tap follow-ups so the student
                        iterates instead of starting over. Only shown when the
                        task config defines them. Hidden after Save (success
                        state takes over). */}
                    {!currentSaved && task.refinementChips && task.refinementChips.length > 0 && (
                      <div className="mb-4 rounded-xl border border-[#1e1e3a] bg-[#06060e]/60 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                          ✨ One-tap refinements
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {task.refinementChips.map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => refineWith(chip.instruction)}
                              disabled={remaining <= 0 || phase !== 'done'}
                              className="rounded-full border border-[#a855f7]/30 bg-[#a855f7]/[0.06] px-3 py-1.5 text-xs font-semibold text-[#cbd5e1] transition hover:border-[#a855f7] hover:bg-[#a855f7]/[0.15] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Save / Regenerate / Upsell — the primary action set
                        BEFORE the student saves. After save, this collapses
                        into the success state below. */}
                    {!currentSaved && (
                      isAuthenticated ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={saveCurrent}
                            className="rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#047857]"
                          >
                            💾 Save This
                          </button>
                          <button
                            type="button"
                            onClick={() => generate()}
                            disabled={remaining <= 0}
                            className="rounded-xl border border-[#1e1e3a] px-4 py-2.5 text-sm font-semibold text-[#94a3b8] transition hover:border-[#a855f7] hover:text-[#a855f7] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            ↻ Regenerate
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Anon users still get the channel hint + send
                              buttons — they have a real artifact, let them
                              use it. Upsell follows below as the progression
                              path, not a gate on usefulness. */}
                          {(task.useWhereHint || task.intentCommit || (task.realWorldActions && task.realWorldActions.length > 0)) && (
                            <div className="mb-4">
                              {/* Intent commit — same rehearsal moment for
                                  anon users (precedes channels). */}
                              {task.intentCommit && (
                                <IntentCommitBlock
                                  config={task.intentCommit}
                                  committed={intentCommitted}
                                  onCommit={() => setIntentCommitted(true)}
                                />
                              )}
                              {task.useWhereHint && (
                                <p className="mb-2 text-sm font-semibold text-[#e2e8f0]">
                                  {task.useWhereHint}
                                </p>
                              )}
                              {task.realWorldActions && task.realWorldActions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {task.realWorldActions.map((act) => (
                                    <button
                                      key={act.label}
                                      type="button"
                                      onClick={() => executeAction(act)}
                                      className="inline-flex items-center gap-2 rounded-lg bg-[#10b981] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_14px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5 hover:bg-[#059669]"
                                    >
                                      {act.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {/* Finish line — same as authed path, names
                                  what "done" looks like inside the tool. */}
                              {task.finishLine && (
                                <div className="mt-3 rounded-lg border border-[#1e1e3a] bg-[#06060e]/60 px-3 py-2.5">
                                  <p className="text-xs font-semibold text-[#cbd5e1]">
                                    {task.finishLine.primary}
                                  </p>
                                  {task.finishLine.microNudge && (
                                    <p className="mt-1 text-xs italic text-[#94a3b8]">
                                      {task.finishLine.microNudge}
                                    </p>
                                  )}
                                </div>
                              )}

                              {actionFlash && (
                                <p className="mt-3 text-xs font-semibold text-[#10b981]">
                                  ✓ {actionFlash} — done
                                </p>
                              )}

                              {/* Send-commitment loop for anon — same UX as
                                  the success-state version, but precedes
                                  the sign-in upsell so the student sees
                                  "did you do it?" BEFORE the ask to save. */}
                              {task.sendCommit && hasTriggeredSendAction && (
                                <SendCommitBlock
                                  config={task.sendCommit}
                                  choice={sendCommitChoice}
                                  onChoose={setSendCommitChoice}
                                />
                              )}
                            </div>
                          )}

                          <div className="rounded-xl border border-[#a855f7]/40 bg-gradient-to-br from-[#a855f7]/[0.08] to-[#3b82f6]/[0.06] p-5">
                            <p className="mb-1.5 text-base font-bold text-[#e2e8f0]">
                              Use this for your own idea →
                            </p>
                            <p className="mb-4 text-sm leading-relaxed text-[#94a3b8]">
                              Sign in (free) to apply this technique to your own business and continue to the next session of your AI journey.
                            </p>
                            <Link
                              href={`/login?next=/learn/session/${sessionNumber}/playground${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                              className="inline-block rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                            >
                              Sign in & continue your AI journey →
                            </Link>
                            <p className="mt-2 text-xs text-[#94a3b8]">Free account · 10 seconds</p>
                          </div>
                        </>
                      )
                    )}

                    {/* Success state — the achievement moment. Bigger, bolder
                        headline, real-world actions, AND the natural progression
                        CTA so this stops feeling like an end and starts feeling
                        like a checkpoint in a longer arc. */}
                    {currentSaved && (
                      <div className="overflow-hidden rounded-2xl border border-[#10b981]/50 bg-gradient-to-br from-[#10b981]/[0.14] via-[#0c0c1a] to-[#06060e] p-6 shadow-[0_0_36px_-8px_rgba(16,185,129,0.4)]">
                        <div className="mb-4 flex items-start gap-4">
                          <span
                            className="grid size-12 shrink-0 place-items-center rounded-full bg-[#10b981]/25 text-2xl shadow-[0_0_24px_rgba(16,185,129,0.65)]"
                            aria-hidden
                          >
                            ✓
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10b981]">
                              Saved · Step complete
                            </p>
                            <p className="mt-1 text-xl font-extrabold leading-tight text-white">
                              {task.successHeadline ?? 'Saved to your dashboard.'}
                            </p>
                          </div>
                        </div>

                        {/* Intent commit — rehearsal moment BEFORE the
                            channels. Single tap converts intention to
                            commitment ("I'll use this today"). */}
                        {task.intentCommit && (
                          <IntentCommitBlock
                            config={task.intentCommit}
                            committed={intentCommitted}
                            onCommit={() => setIntentCommitted(true)}
                          />
                        )}

                        {/* Channel hint — sits ABOVE the action buttons as
                            the label that introduces them. */}
                        {task.useWhereHint && (
                          <p className="mb-2 text-sm font-semibold text-[#e2e8f0]">
                            {task.useWhereHint}
                          </p>
                        )}

                        {/* Action row — real-world send buttons take primary
                            visual weight; "Continue to next session" sits
                            beside them as the natural next move. */}
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                          <div className="flex flex-wrap gap-2">
                            {task.realWorldActions && task.realWorldActions.length > 0 ? (
                              task.realWorldActions.map((act) => (
                                <button
                                  key={act.label}
                                  type="button"
                                  onClick={() => executeAction(act)}
                                  className="inline-flex items-center gap-2 rounded-lg bg-[#10b981] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_14px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5 hover:bg-[#059669]"
                                >
                                  {act.label}
                                </button>
                              ))
                            ) : (
                              <p className="text-sm text-[#94a3b8]">
                                Now actually use it — don&apos;t let it sit in your dashboard.
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/learn/session/${sessionNumber + 1}${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#a855f7]/40 bg-[#a855f7]/[0.08] px-4 py-2.5 text-sm font-bold text-[#a855f7] transition hover:bg-[#a855f7]/[0.18] hover:text-white"
                          >
                            {task.continueButtonLabel ?? `Apply this & continue to Session ${sessionNumber + 1} →`}
                          </Link>
                        </div>

                        {/* Finish line — names what "done" looks like so the
                            user has a clear stop condition once they're inside
                            the destination tool (Midjourney, Gamma, etc.). */}
                        {task.finishLine && (
                          <div className="mt-3 rounded-lg border border-[#1e1e3a] bg-[#06060e]/60 px-3 py-2.5">
                            <p className="text-xs font-semibold text-[#cbd5e1]">
                              {task.finishLine.primary}
                            </p>
                            {task.finishLine.microNudge && (
                              <p className="mt-1 text-xs italic text-[#94a3b8]">
                                {task.finishLine.microNudge}
                              </p>
                            )}
                            {task.finishLine.followThroughNudge && (
                              <p className="mt-2 border-t border-[#1e1e3a] pt-2 text-xs font-semibold text-[#10b981]">
                                {task.finishLine.followThroughNudge}
                              </p>
                            )}
                          </div>
                        )}

                        {actionFlash && (
                          <p className="mt-3 text-xs font-semibold text-[#10b981]">
                            ✓ {actionFlash} — done
                          </p>
                        )}

                        {/* Send-commitment loop — prompts the student to
                            self-confirm whether they actually sent the
                            output. Yes locks in identity; Not-yet nudges. */}
                        {task.sendCommit && hasTriggeredSendAction && (
                          <SendCommitBlock
                            config={task.sendCommit}
                            choice={sendCommitChoice}
                            onChoose={setSendCommitChoice}
                          />
                        )}

                        {/* Test reflection — turns the abstract "you tested
                            it" into a tactile self-confirmation. The chips
                            don't save anywhere; the click IS the value. */}
                        {task.testReflection && (
                          <div className="mt-5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/[0.04] p-4">
                            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-[#10b981]">
                                  {task.testReflection.headline}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#e2e8f0]">
                                  {task.testReflection.prompt}
                                </p>
                                {task.testReflection.hint && (
                                  <p className="mt-1 text-xs italic text-[#94a3b8]">
                                    💡 {task.testReflection.hint}
                                  </p>
                                )}
                              </div>
                              {reflectionPicks.size > 0 && (
                                <span
                                  key={reflectionPicks.size}
                                  className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#10b981] [animation:tara-pop_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                                >
                                  ✓ {reflectionPicks.size} improvement{reflectionPicks.size === 1 ? '' : 's'} identified
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {task.testReflection.chips.map((chip) => {
                                const picked = reflectionPicks.has(chip);
                                return (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => toggleReflection(chip)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                      picked
                                        ? 'scale-105 border-[#10b981] bg-[#10b981]/[0.20] text-[#10b981] shadow-[0_0_18px_-2px_rgba(16,185,129,0.7)]'
                                        : 'border-[#1e1e3a] bg-[#06060e] text-[#94a3b8] hover:border-[#10b981]/40 hover:text-[#cbd5e1]'
                                    }`}
                                  >
                                    {picked && '✓ '}{chip}
                                  </button>
                                );
                              })}
                            </div>
                            {reflectionPicks.size > 0 && task.testReflection.identityLine && (
                              <p className="mt-4 rounded-lg border-l-2 border-[#10b981] bg-[#10b981]/[0.06] px-3 py-2 text-sm italic leading-relaxed text-[#e2e8f0]">
                                {task.testReflection.identityLine}
                              </p>
                            )}
                            <style>{`
                              @keyframes tara-pop {
                                0%   { transform: scale(0.6); opacity: 0; }
                                60%  { transform: scale(1.15); opacity: 1; }
                                100% { transform: scale(1); }
                              }
                            `}</style>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>

          {/* ── BOTTOM STRIP — hidden once the success state above is in
              charge of the next-step CTA. Shown only as historical context
              for stale states (e.g. landing fresh with no current generation
              loaded into the response panel). ── */}
          {savedArtifact && hasSavedFirst && !currentSaved && (
            <section className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-5">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                <ArtifactCell
                  icon="📅"
                  label="Date"
                  body={
                    <>
                      {new Date(savedArtifact.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      <span className="text-xs text-[#94a3b8]">
                        {new Date(savedArtifact.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </>
                  }
                />
                <ArtifactCell
                  icon="✏️"
                  label="Prompt"
                  body={<>{truncate(savedArtifact.prompt, 80)}</>}
                />
                <ArtifactCell
                  icon="💬"
                  label="Output Preview"
                  body={
                    <>
                      {truncate(savedArtifact.response, 80)}
                      <br />
                      <button
                        type="button"
                        onClick={() => {
                          setResponse(savedArtifact.response);
                          setPrompt(savedArtifact.prompt);
                          setPhase('done');
                        }}
                        className="mt-1 text-xs font-semibold text-[#a855f7] hover:underline"
                      >
                        View Full Output →
                      </button>
                    </>
                  }
                />
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
                    <span aria-hidden>🚀</span> Next Step
                  </div>
                  <Link
                    href={`/learn/session/${sessionNumber}${courseId !== 'ai-tools-mastery-beginners' ? `?course=${courseId}` : ''}`}
                    className="inline-block rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#a855f7] px-4 py-2 text-sm font-bold text-white shadow-[0_0_16px_rgba(99,102,241,0.4)] transition hover:-translate-y-0.5"
                  >
                    Continue Session →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt('');
                      setResponse('');
                      setPhase('idle');
                      setCurrentSaved(false);
                    }}
                    className="mt-1 block text-xs text-[#a855f7] hover:underline"
                  >
                    Try another prompt
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function ArtifactCell({
  icon,
  label,
  body,
}: {
  icon: string;
  label: string;
  body: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
        <span aria-hidden>{icon}</span> {label}
      </div>
      <div className="text-sm text-[#e2e8f0]">{body}</div>
    </div>
  );
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1).trimEnd() + '…';
}

// Channel chip helpers for the action-first success state. Maps short
// identifier strings (set in playgroundTask.useThisIn) to a small icon and
// human label. Unknown channels degrade to capitalized text — the chip
// row stays useful even if a typo slips through.
const CHANNEL_META: Record<string, { icon: string; label: string }> = {
  whatsapp: { icon: '💬', label: 'WhatsApp' },
  instagram: { icon: '📷', label: 'Instagram' },
  linkedin: { icon: '💼', label: 'LinkedIn' },
  email: { icon: '📧', label: 'Email' },
  sms: { icon: '📲', label: 'SMS' },
  twitter: { icon: '𝕏', label: 'X' },
  facebook: { icon: '📘', label: 'Facebook' },
  telegram: { icon: '✈️', label: 'Telegram' },
};
function channelIcon(c: string): string {
  return CHANNEL_META[c]?.icon ?? '•';
}
function channelLabel(c: string): string {
  return CHANNEL_META[c]?.label ?? c.charAt(0).toUpperCase() + c.slice(1);
}

// Intent commit — sits BEFORE the channel buttons. A single tap converts
// "I have the line" → "I'm using it today". No persistence; the click
// itself is the value (psychological commitment device).
function IntentCommitBlock({
  config,
  committed,
  onCommit,
}: {
  config: NonNullable<PlaygroundTask['intentCommit']>;
  committed: boolean;
  onCommit: () => void;
}) {
  if (committed) {
    return (
      <div className="mb-4 rounded-xl border border-[#10b981]/45 bg-[#10b981]/[0.10] px-4 py-2.5 [animation:tara-pop_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#10b981]">
          <span aria-hidden>✓</span> {config.confirmedLine}
        </p>
        {/* Next micro-step — converts the lock-in moment into immediate
            action by naming the literal next 60-180 seconds. */}
        {config.nextMicroStep && (
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-[#cbd5e1]">
            {config.nextMicroStep}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="mb-4 rounded-xl border border-[#fbbf24]/30 bg-gradient-to-r from-[#fbbf24]/[0.06] to-transparent px-4 py-3">
      <p className="mb-2 text-sm leading-relaxed text-[#e2e8f0]">
        🗣️ {config.reinforcement}
      </p>
      <button
        type="button"
        onClick={onCommit}
        className="rounded-lg bg-[#fbbf24] px-4 py-2 text-xs font-extrabold text-[#1e1e3a] shadow-[0_0_16px_-2px_rgba(251,191,36,0.5)] transition hover:-translate-y-0.5 hover:bg-[#f59e0b]"
      >
        {config.ctaLabel}
      </button>
    </div>
  );
}

// Commitment loop after a send action. The block has 3 visual states:
// idle  → prompt + Yes / Not-yet buttons
// yes   → green reinforcement (locks identity)
// no    → amber nudge with a "Mark as sent" escape hatch
function SendCommitBlock({
  config,
  choice,
  onChoose,
}: {
  config: NonNullable<PlaygroundTask['sendCommit']>;
  choice: 'yes' | 'not-yet' | null;
  onChoose: (c: 'yes' | 'not-yet') => void;
}) {
  if (choice === 'yes') {
    return (
      <div className="mt-4 rounded-xl border border-[#10b981]/45 bg-gradient-to-br from-[#10b981]/[0.12] to-transparent px-4 py-3">
        <p className="text-sm font-bold leading-relaxed text-[#10b981]">
          {config.yesReinforcement}
        </p>
      </div>
    );
  }
  if (choice === 'not-yet') {
    return (
      <div className="mt-4 rounded-xl border border-[#fbbf24]/40 bg-gradient-to-br from-[#fbbf24]/[0.10] to-transparent px-4 py-3">
        <p className="mb-2 text-sm font-semibold leading-relaxed text-[#fbbf24]">
          {config.noNudge}
        </p>
        <button
          type="button"
          onClick={() => onChoose('yes')}
          className="text-xs font-bold text-[#10b981] transition hover:text-[#34d399]"
        >
          ✅ Mark as sent →
        </button>
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/[0.04] p-4">
      <p className="mb-3 text-sm font-bold text-[#e2e8f0]">
        🎯 {config.prompt}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChoose('yes')}
          className="rounded-lg bg-[#10b981] px-4 py-2 text-xs font-extrabold text-white shadow-[0_0_16px_-2px_rgba(16,185,129,0.45)] transition hover:-translate-y-0.5 hover:bg-[#059669]"
        >
          {config.yesLabel}
        </button>
        <button
          type="button"
          onClick={() => onChoose('not-yet')}
          className="rounded-lg border border-[#fbbf24]/40 bg-[#fbbf24]/[0.06] px-4 py-2 text-xs font-extrabold text-[#fbbf24] transition hover:bg-[#fbbf24]/[0.14]"
        >
          {config.noLabel}
        </button>
      </div>
    </div>
  );
}

// One section of the structured AI output. `emphasised=true` is for cards
// that came from a `## Heading` (Week 1, Portfolio, etc.) — they get the
// cyan title bar. `emphasised=false` (intro/lead chunk) renders flat.
// When `onToggleStarted` is provided, the card grows a per-section "Start"
// commitment toggle — cheap action that converts reading into doing.
function SectionCard({
  title,
  body,
  emphasised,
  started,
  onToggleStarted,
}: {
  title: string | null;
  body: string;
  emphasised: boolean;
  started: boolean;
  onToggleStarted?: () => void;
}) {
  const html = renderMarkdown(body);
  if (!emphasised) {
    return (
      <div
        className="prose prose-sm prose-invert max-w-none px-1 prose-p:my-1.5 prose-strong:text-white prose-blockquote:border-l-[#00f0ff] prose-blockquote:bg-[#00f0ff]/[0.05] prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-[#e2e8f0] prose-ul:my-1.5 prose-li:my-0.5 prose-code:rounded prose-code:bg-[#1e1e3a] prose-code:px-1 prose-code:py-0.5 prose-code:text-[#fbbf24] prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  // Detect Week N sections — only those get the "Start this week" toggle.
  // Generic emphasised cards (Portfolio, Ethical Rule, etc.) skip it.
  const isWeekly = title ? /^week\s+\d/i.test(title) : false;
  const showAction = isWeekly && !!onToggleStarted;
  return (
    <article
      className={`overflow-hidden rounded-lg border bg-[#0c0c1a] transition ${
        started
          ? 'border-[#10b981]/60 shadow-[0_0_18px_-6px_rgba(16,185,129,0.5)]'
          : 'border-[#1e1e3a]'
      }`}
    >
      <header
        className={`flex items-center justify-between gap-2 border-b px-4 py-2 ${
          started
            ? 'border-[#10b981]/30 bg-gradient-to-r from-[#10b981]/[0.10] to-transparent'
            : 'border-[#1e1e3a] bg-gradient-to-r from-[#00f0ff]/[0.06] to-transparent'
        }`}
      >
        <h3
          className={`font-mono text-xs font-bold uppercase tracking-[0.16em] ${
            started ? 'text-[#10b981]' : 'text-[#00f0ff]'
          }`}
        >
          {started && '✓ '}
          {title}
        </h3>
        {started && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#10b981]">
            Started
          </span>
        )}
      </header>
      <div
        className="prose prose-sm prose-invert max-w-none px-4 py-3 prose-p:my-1.5 prose-strong:text-white prose-ul:my-1.5 prose-li:my-0.5 prose-code:rounded prose-code:bg-[#1e1e3a] prose-code:px-1 prose-code:py-0.5 prose-code:text-[#fbbf24] prose-code:before:content-none prose-code:after:content-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showAction && (
        <footer className="border-t border-[#1e1e3a] bg-[#06060e]/60 px-4 py-2.5">
          <button
            type="button"
            onClick={onToggleStarted}
            className={`text-xs font-bold transition ${
              started
                ? 'text-[#10b981] hover:text-[#34d399]'
                : 'text-[#a855f7] hover:text-[#c084fc]'
            }`}
          >
            {started ? '✓ Started — tap to undo' : `▶ Start ${title} task today`}
          </button>
        </footer>
      )}
    </article>
  );
}
