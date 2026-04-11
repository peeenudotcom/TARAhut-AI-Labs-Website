'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-[95vh] flex items-center"
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
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28 w-full">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16 items-center">

          {/* LEFT — Copy and CTAs */}
          <div className="text-center md:text-left">
            {/* Trust Badge — honest narrow claim */}
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

            {/* Heading */}
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

            {/* Subheading */}
            <motion.p
              className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Master ChatGPT, Claude, Canva AI &amp; Automation at Punjab&apos;s first dedicated
              offline AI training center — hands-on projects, real outcomes, no fluff.
            </motion.p>

            {/* Fear Removal Line */}
            <motion.p
              className="mt-3 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              No coding required &nbsp;•&nbsp; Beginner friendly &nbsp;•&nbsp; Real projects
            </motion.p>

            {/* Location Badge */}
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

            {/* CTA Buttons */}
            <motion.div
              className="mt-10 flex justify-center md:justify-start gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              {/* Primary */}
              <a
                href="https://wa.me/919200882008?text=Hi%2C+I+want+to+book+a+free+demo+class+at+TARAhut+AI+Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl
                           bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500
                           text-black font-semibold
                           shadow-[0_10px_40px_rgba(16,185,129,0.35)]
                           hover:scale-105 hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)]
                           transition-all duration-300"
              >
                📅 Book Free Demo
              </a>

              {/* Secondary */}
              <Link
                href="/courses"
                className="px-8 py-4 rounded-xl
                           border border-white/10 text-gray-300
                           hover:bg-white/5 hover:text-white
                           transition-all duration-300"
              >
                Explore Courses →
              </Link>
            </motion.div>

            {/* Tools strip */}
            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <span className="text-gray-500 font-medium">Tools you&apos;ll master:</span>
              {['ChatGPT', 'Claude', 'Canva AI', 'Midjourney', 'Python', '10+ more'].map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-medium text-gray-400"
                >
                  {tool}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Founder portrait */}
          <motion.div
            className="relative flex items-center justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="relative">
              {/* Decorative emerald glow behind photo */}
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-transparent blur-2xl" />

              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-[32px] border border-emerald-400/30" />

              {/* Photo container */}
              <div className="relative rounded-[28px] overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-emerald-500/20 w-[280px] sm:w-[340px] md:w-[380px] aspect-[4/5] bg-gradient-to-b from-slate-800 to-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/parveen-sukhija.jpeg"
                  alt="Parveen Sukhija — Founder, TARAhut AI Labs"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Bottom label */}
                <div className="absolute inset-x-4 bottom-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full bg-emerald-400/20 backdrop-blur-sm border border-emerald-300/30">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-200">
                      Meet the Man Behind the Idea
                    </p>
                  </div>
                  <h3 className="text-xl font-bold text-white">Parveen Sukhija</h3>
                  <p className="text-xs text-emerald-200/90">Founder · TARAhut AI Labs</p>
                </div>
              </div>

              {/* Floating credibility cards */}
              <motion.div
                className="absolute -left-4 top-10 md:-left-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                  Experience
                </p>
                <p className="text-sm font-bold text-white mt-0.5">20+ Years</p>
                <p className="text-[10px] text-gray-400">Education &amp; Tech</p>
              </motion.div>

              <motion.div
                className="absolute -right-2 bottom-24 md:-right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                  Based in
                </p>
                <p className="text-sm font-bold text-white mt-0.5">Kotkapura</p>
                <p className="text-[10px] text-gray-400">Punjab, India</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xs text-gray-700">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gray-700">
            <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
