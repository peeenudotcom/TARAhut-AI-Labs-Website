'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { NeuralNavigatorLoader } from './neural-navigator-loader'
import { ROLE_LABEL, useUserRole, type UserRole } from '@/lib/hooks/use-user-role'

// Role-aware hero copy. Default state keeps the original headline
// for cold visitors. When the Career Architect has saved a role to
// localStorage, the headline + sub + primary CTA swap to match.
// `emphasizedSlugs` are the course slugs the galaxy should glow
// brighter for that role (passed through to NeuralNavigatorLoader).
const HERO_VARIANTS: Record<
  UserRole | 'default',
  {
    headlineLead: string
    headlineAccent: string
    sub: string
    primaryCta: { label: string; href: string }
    emphasizedSlugs: string[]
  }
> = {
  default: {
    headlineLead: 'Learn AI Skills',
    headlineAccent: 'That Actually Pay',
    sub: "Master ChatGPT, Claude, Canva AI & Automation at Punjab's first dedicated offline AI training center — hands-on projects, real outcomes, no fluff.",
    primaryCta: { label: '🚀 Try a Free AI Lesson', href: '/learn' },
    emphasizedSlugs: [],
  },
  'biz-owner': {
    headlineLead: 'AI-Power',
    headlineAccent: 'Your Business.',
    sub: 'Save 20+ hours a week and cut overhead with AI agents, automated marketing, and 24/7 customer workflows — built right here in Punjab.',
    primaryCta: { label: 'Calculate Business ROI →', href: '/start' },
    emphasizedSlugs: ['ai-digital-marketing', 'master-ai-builder'],
  },
  student: {
    headlineLead: 'Become an',
    headlineAccent: 'AI-Fluent Professional.',
    sub: 'High-paying remote roles, global freelance projects, and TARAhut certification — designed for students aiming at AI-ready careers.',
    primaryCta: { label: 'Download Student Roadmap →', href: '/start' },
    emphasizedSlugs: ['generative-ai-prompt-engineering', 'master-ai-builder'],
  },
  freelancer: {
    headlineLead: 'Master',
    headlineAccent: 'Creative Generative AI.',
    sub: 'Midjourney, HeyGen, ElevenLabs, and Custom GPTs — the toolset that lets freelancers ship high-ticket creative work in days, not weeks.',
    primaryCta: { label: 'See Freelancer Roadmap →', href: '/start' },
    emphasizedSlugs: ['ai-tools-mastery-beginners', 'generative-ai-prompt-engineering'],
  },
  professional: {
    headlineLead: 'Outpace your team',
    headlineAccent: 'with AI fluency.',
    sub: 'Reclaim 10+ hours a week on the tools you already open daily — Claude, ChatGPT, automation. Practical AI for in-house roles.',
    primaryCta: { label: 'See Pro Roadmap →', href: '/start' },
    emphasizedSlugs: ['ai-tools-mastery-beginners', 'master-claude-15-days'],
  },
}

export function HeroSection() {
  const { role, setRole } = useUserRole()
  const variant = HERO_VARIANTS[role ?? 'default']
  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ backgroundColor: '#020617' }}
    >
      {/* 🌌 Background Glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{ background: 'rgba(16,185,129,0.14)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.10)' }}
        />
      </div>

      {/* 🌐 Grid Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.06) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* SYSTEM HUD chip — appears in the top-right of the hero
          when a role has been detected. Tells the user "the site
          is reacting to you" without being intrusive. Click ✕ to
          revert to the default profile. */}
      <AnimatePresence>
        {role && (
          <motion.div
            key="role-hud"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-4 top-20 z-20 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-black/55 px-3 py-1.5 backdrop-blur-md sm:right-6 sm:top-24"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <span className="text-emerald-400">[SYSTEM]</span>{' '}
              Optimized for {ROLE_LABEL[role]}
            </span>
            <button
              type="button"
              onClick={() => setRole(null)}
              aria-label="Reset profile"
              className="ml-1 flex size-4 items-center justify-center rounded-full text-emerald-300/60 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20 w-full">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-12 items-center">

          {/* LEFT — Copy and CTAs (from v1) */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6
                              rounded-full bg-white/5 border border-emerald-400/20
                              backdrop-blur-md text-sm text-emerald-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                🇮🇳 First Offline AI Labs of Punjab
              </div>
            </motion.div>

            {/* Headline + sub: keyed on role so they crossfade if the
                user changes profile in another tab. */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h-${role ?? 'default'}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
              >
                {variant.headlineLead}{' '}
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    {variant.headlineAccent}
                  </span>
                </span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`s-${role ?? 'default'}`}
                className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                {variant.sub}
              </motion.p>
            </AnimatePresence>

            <motion.p
              className="mt-3 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              No coding required &nbsp;•&nbsp; Beginner friendly &nbsp;•&nbsp; Real projects
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2
                              rounded-full bg-emerald-500/10 border border-emerald-400/20
                              text-sm text-emerald-300">
                📍 Offline AI Training in Kotkapura (Punjab)
              </span>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <Link
                href={variant.primaryCta.href}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                {variant.primaryCta.label}
              </Link>
              <Link
                href="/learn"
                className="inline-flex flex-col items-center justify-center rounded-lg border border-yellow-400/60 bg-yellow-400/[0.06] px-6 py-3 text-sm font-bold text-[#facc15] transition-all duration-200
                           shadow-[0_0_18px_rgba(250,204,21,0.2)]
                           hover:border-yellow-300 hover:bg-yellow-400/15 hover:text-yellow-200 hover:shadow-[0_0_28px_rgba(250,204,21,0.45)]"
              >
                Buy Any Online Course at ₹999/-
                <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-yellow-300/85">(Limited Time Offer)</span>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Explore Programs →
              </Link>
            </motion.div>

            {/* Social proof — the "atmosphere" around the galaxy. Sits
                just above the tools ticker so users read trust before
                scanning the toolset. */}
            <motion.p
              className="mt-8 flex items-center justify-center md:justify-start gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald-300/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.68 }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              9 courses · 20+ AI tools · in-person + online
            </motion.p>

            <motion.div
              className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <span className="text-gray-500 font-medium">Tools you&apos;ll master:</span>
              {['ChatGPT', 'Claude', 'Canva AI', 'Midjourney', 'Python', '10+ more'].map((tool) => (
                <span
                  key={tool}
                  tabIndex={0}
                  className="group cursor-default rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-medium text-gray-400
                             transition-all duration-300 ease-out
                             hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-emerald-400/[0.08] hover:text-emerald-200
                             hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]
                             focus:outline-none focus-visible:border-emerald-400/60 focus-visible:text-emerald-100 focus-visible:shadow-[0_0_18px_rgba(16,185,129,0.45)]"
                >
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Neural Navigator (R3F). Interactive 3D graph of all 9
              courses; click a node to reveal the course and jump into the
              funnel. Replaces the founder portrait — that asset can move
              to the "Why TARAhut" section or About page in a follow-up.
              The component is lazy-loaded (dynamic import, ssr:false) so
              the ~350KB three/r3f bundle doesn't block initial paint.
              Mobile + reduced-motion users get a static decorative
              fallback instead of the WebGL canvas. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full"
          >
            <NeuralNavigatorLoader emphasizedSlugs={variant.emphasizedSlugs} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
