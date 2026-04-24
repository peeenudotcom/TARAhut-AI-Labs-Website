'use client';

import { motion } from 'framer-motion';
import type { VoiceStatus } from '@/lib/hooks/use-voice-command';
import { getTheme } from '@/config/subdomain-themes';

interface Props {
  status: VoiceStatus;
  transcript: string;
  onCancel: () => void;
  /**
   * Active landing-page subdomain. Themed subdomains (claude, hustler)
   * render a branded pill above the ripple stack — e.g.
   * `[ CLAUDE-POWERED VOICE ASSISTANT ]`. Unthemed or null → no pill.
   * Branding labels live in `src/config/subdomain-themes.ts`.
   */
  subdomain?: string | null;
}

const STATUS_LABEL: Record<VoiceStatus, string> = {
  idle: '',
  listening: 'LISTENING…',
  processing: 'PROCESSING INTENT…',
  success: 'GOT IT ✓',
  error: 'TRY AGAIN',
};

// Voice Overlay — the visible side of voice commands. Renders a
// dim full-screen backdrop, three concentric emerald ripple rings
// centred on the screen, the transcribed speech (when there is
// some), and a high-contrast status label above the rings.
//
// Pure CSS for the ripple cadence — using AnalyserNode would let
// the rings react to actual mic volume, but it adds a chunk of
// browser permissions UX and audio-graph wiring; the CSS version
// reads as "live" and is one round-trip simpler. Easy to swap in
// the analyser later if needed.
export function VoiceOverlay({ status, transcript, onCancel, subdomain }: Props) {
  const label = STATUS_LABEL[status];
  const theme = getTheme(subdomain);
  const hudBrand = theme.voiceHudLabel;
  // Accent colour for the branding pill border + glow. Falls back to
  // primary when no accent is defined (Claude = pure emerald; Hustler
  // = gold over emerald).
  const pillAccent = theme.accent ?? theme.primary;
  const pillAccentRgb = theme.accentRgb ?? theme.primaryRgb;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
      onClick={onCancel}
    >
      {/* Dimmed backdrop — focuses attention on the conversation */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Ripple stack */}
      <div className="relative flex flex-col items-center gap-6 sm:gap-8">
        {/* Per-theme HUD branding — sits above the ripples as a
            persistent tag that telegraphs "this voice is powered by
            X on this page". Pill border + glow use the theme's
            accent colour (gold on Hustler, emerald on Claude). */}
        {hudBrand && (
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-full border bg-black/80 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] backdrop-blur-md"
            style={{
              borderColor: `rgba(${pillAccentRgb}, 0.5)`,
              color: pillAccent,
              boxShadow: `0 0 22px rgba(${pillAccentRgb}, 0.55)`,
            }}
          >
            [ {hudBrand} ]
          </motion.span>
        )}

        <div className="relative size-56 sm:size-64">
          {/* Three concentric rings, staggered phase so they never
              line up — gives the impression of continuous ripple. */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border border-emerald-400"
              style={{
                animation: `voice-ripple 1.6s ease-out ${i * 0.45}s infinite`,
                opacity: 0,
              }}
            />
          ))}

          {/* Solid core orb in the centre */}
          <motion.div
            className="absolute inset-[34%] rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_0_44px_rgba(16,185,129,0.65)] ring-2 ring-emerald-300/40"
            animate={{
              scale: status === 'listening' ? [1, 1.08, 1] : 1,
            }}
            transition={{
              duration: 1.6,
              repeat: status === 'listening' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          <style>{`
            @keyframes voice-ripple {
              0%   { transform: scale(0.4); opacity: 0; }
              20%  { opacity: 0.8; }
              100% { transform: scale(1.8); opacity: 0; }
            }
          `}</style>
        </div>

        {/* Status label — high contrast monospace above the rings */}
        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-emerald-400/40 bg-black/70 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.4)] backdrop-blur-md">
            [ {label} ]
          </span>
          {transcript && (
            <p className="max-w-md px-6 font-['Space_Grotesk',sans-serif] text-lg text-white/95 sm:text-xl">
              &ldquo;{transcript}&rdquo;
            </p>
          )}
          {!transcript && status === 'listening' && (
            <p className="px-6 text-sm text-white/55">
              Try: &ldquo;show the syllabus&rdquo;, &ldquo;what&apos;s the price&rdquo;, &ldquo;book a demo&rdquo;
            </p>
          )}
          {status === 'error' && (
            <p className="px-6 text-sm text-red-300">
              Couldn&apos;t hear you. Tap to dismiss and try again.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="relative mt-2 rounded-full border border-white/15 bg-black/60 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md transition-colors hover:border-emerald-400/60 hover:text-emerald-200"
        >
          Cancel · Esc
        </button>
      </div>
    </motion.div>
  );
}
