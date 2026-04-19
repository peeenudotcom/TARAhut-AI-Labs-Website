'use client'

import { motion } from 'framer-motion'

const features = [
  {
    number: '01',
    title: 'Real AI Projects',
    description: 'Build 10+ portfolio-worthy projects using actual tools — not just slides and theory. Every class ends with something you can show employers.',
    stat: '10+ projects',
    accent: {
      from: '#10b981',
      to: '#14b8a6',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Learn from Practitioners',
    description: '20+ years of industry experience. Your instructor has actually used AI to build products and businesses — not just read about it.',
    stat: '20+ years',
    accent: {
      from: '#3b82f6',
      to: '#6366f1',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      glow: 'rgba(59, 130, 246, 0.25)',
    },
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Portfolio + Certification',
    description: 'Walk away with a verified certificate AND a portfolio of real projects. Employers and clients can check both online.',
    stat: 'Verifiable',
    accent: {
      from: '#f59e0b',
      to: '#f97316',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Income-Focused Learning',
    description: 'Every course is designed around a clear income outcome — freelancing, job placement, or growing your business. You learn to earn.',
    stat: '₹20K-50K/mo',
    accent: {
      from: '#e53935',
      to: '#ec4899',
      bg: 'rgba(229, 57, 53, 0.08)',
      border: 'rgba(229, 57, 53, 0.3)',
      glow: 'rgba(229, 57, 53, 0.25)',
    },
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
]

export function WhyUplrn() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(229, 57, 53, 0.08)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'rgba(59, 130, 246, 0.07)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'rgba(16, 185, 129, 0.06)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e53935] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e53935]" />
            </span>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#e53935]">
              Why TARAhut AI Labs
            </p>
          </div>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Not Just Another{' '}
            <span className="relative inline-block">
              <span className="relative z-10">IT Institute</span>
              <motion.span
                className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-[#e53935]/30 to-[#f59e0b]/30 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            We built TARAhut AI Labs because we were tired of courses that teach theory but not income. Here&apos;s what makes us different.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7 transition-all duration-500 hover:-translate-y-2"
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
              whileHover={{
                boxShadow: `0 20px 60px -15px ${feature.accent.glow}, 0 0 0 1px ${feature.accent.border}`,
              }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              {/* Top gradient bar (visible on hover) */}
              <div
                className="absolute inset-x-6 top-0 h-1 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, ${feature.accent.from}, ${feature.accent.to})` }}
              />

              {/* Big outlined number in background */}
              <div
                className="absolute top-4 right-5 text-7xl font-black leading-none pointer-events-none select-none"
                style={{
                  WebkitTextStroke: `2px ${feature.accent.border}`,
                  color: 'transparent',
                  opacity: 0.6,
                }}
              >
                {feature.number}
              </div>

              {/* Icon container */}
              <motion.div
                className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${feature.accent.from}, ${feature.accent.to})`,
                  boxShadow: `0 8px 24px -8px ${feature.accent.glow}`,
                }}
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <h3 className="relative z-10 text-lg font-bold text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>

              {/* Stat chip */}
              <div
                className="relative z-10 mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: feature.accent.bg,
                  color: feature.accent.from,
                }}
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature.stat}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle bottom CTA hint */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            Ready to experience the difference?{' '}
            <a href="/courses" className="font-semibold text-[#e53935] hover:underline">
              Explore our courses →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
