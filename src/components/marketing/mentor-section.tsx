'use client'

import { motion } from 'framer-motion'

const cards = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Standardized Curriculum',
    description: 'Every course follows a structured, battle-tested curriculum — ensuring consistent quality regardless of location or instructor.',
    accent: 'from-red-400 to-red-400',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Practical Learning System',
    description: 'Learners build real projects from day one. No theory-only lectures — every session ends with a usable output.',
    accent: 'from-blue-400 to-indigo-400',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: 'Scalable Center Model',
    description: 'The entire system is designed to be replicated. New locations can onboard quickly with full operational support.',
    accent: 'from-amber-400 to-orange-400',
  },
]

export function MentorSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-red-600">
            Our System
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Built for Scale. Designed for Results.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[#475569] text-lg leading-relaxed">
            TARAhut AI Labs is a structured AI education system designed to deliver consistent, practical learning outcomes across locations.
            From curriculum to delivery, everything is built to scale — making it ideal for both learners and business partners.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              className="group relative rounded-2xl border border-[#E2E8F0] bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${card.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-sm`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A]">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
