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
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: 'rgba(16,185,129,0.10)' }}
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

      {/* ✨ Floating Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] top-[-100px] left-1/2 -translate-x-1/2"
          style={{ background: 'rgba(16,185,129,0.05)' }}
        />
      </div>

      {/* 🎯 Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center w-full">

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6
                          rounded-full bg-white/5 border border-white/10
                          backdrop-blur-md text-sm text-gray-300">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Trusted by 500+ students across Punjab
          </div>
        </motion.div>


        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight"
        >
          Punjab&apos;s First AI Lab{' '}
          <span className="text-emerald-300 block mt-2">
            Learn AI Skills That Actually Pay
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Master ChatGPT, Claude, Canva AI &amp; Automation — then use these skills
          for freelancing, job placement, or growing your business.
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
          className="mt-10 flex justify-center gap-4 flex-wrap"
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
                       text-black font-medium
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
          className="mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-600"
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

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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
