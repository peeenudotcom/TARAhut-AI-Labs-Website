'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Real AI Projects',
    description: 'Build 10+ portfolio-worthy projects using actual tools — not just slides and theory. Every class ends with something you can show employers.',
    accent: 'from-red-400 to-red-400',
    glow: 'group-hover:shadow-red-500/20',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Learn from Practitioners',
    description: '20+ years of industry experience. Your instructor has actually used AI to build products and businesses — not just read about it.',
    accent: 'from-blue-400 to-indigo-400',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Portfolio + Certification',
    description: 'Walk away with a verified certificate AND a portfolio of real projects. Employers and clients can check both online.',
    accent: 'from-amber-400 to-orange-400',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Income-Focused Learning',
    description: 'Every course is designed around a clear income outcome — freelancing, job placement, or growing your business. You learn to earn.',
    accent: 'from-rose-400 to-pink-400',
    glow: 'group-hover:shadow-rose-500/20',
  },
]

export function WhyUplrn() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-red-600">
            Why TARAhut AI Labs
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Not Just Another IT Institute
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#475569]">
            We built TARAhut AI Labs because we were tired of courses that teach theory but not income. Here&apos;s what makes us different.
          </p>
        </motion.div>

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
              className={`group relative rounded-2xl border border-[#E2E8F0] bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.glow}`}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              {/* Top gradient accent bar */}
              <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${feature.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
