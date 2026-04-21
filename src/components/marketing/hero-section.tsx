'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { NeuralNavigatorLoader } from './neural-navigator-loader'

export function HeroSection() {
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

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Learn AI Skills{' '}
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  That Actually Pay
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Master ChatGPT, Claude, Canva AI &amp; Automation at Punjab&apos;s first dedicated
              offline AI training center — hands-on projects, real outcomes, no fluff.
            </motion.p>

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
                href="/learn"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                🚀 Try a Free AI Lesson
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
              Trusted by 500+ students across Punjab
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
            <NeuralNavigatorLoader />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
