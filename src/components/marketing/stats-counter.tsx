'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2, ease: 'easeOut' })
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`
      }
    })
    return unsubscribe
  }, [rounded, prefix, suffix])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

// Honest, verifiable facts — no student counts, no placement rates.
// Every number here can be defended by pointing at courses.ts or the site.
const stats = [
  {
    icon: '🎓',
    value: 9,
    suffix: '',
    prefix: '',
    label: 'Hands-On Courses',
    subLabel: 'Beginner to Advanced',
    isNumber: true,
  },
  {
    icon: '🛠️',
    value: 10,
    suffix: '+',
    prefix: '',
    label: 'AI Tools Covered',
    subLabel: 'ChatGPT, Claude, Canva & more',
    isNumber: true,
  },
  {
    icon: '💰',
    value: 2499,
    suffix: '',
    prefix: '₹',
    label: 'Starting Price',
    subLabel: 'EMI options available',
    isNumber: true,
  },
  {
    icon: '🏫',
    value: 0,
    suffix: '',
    prefix: '',
    label: 'First Offline AI Lab',
    subLabel: 'In Punjab, based in Kotkapura',
    isNumber: false,
    staticText: '#1',
  },
]

export function StatsCounter() {
  return (
    <section className="border-y border-[#E2E8F0] bg-gradient-to-b from-[#F0FDF4] via-white to-[#F0FDF4]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">
            What You Get
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Real Training, Real Numbers, Real Value
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="relative group bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              {/* Icon */}
              <div className="text-3xl mb-3">{stat.icon}</div>

              {/* Number */}
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-[#0F172A] leading-none">
                {stat.isNumber ? (
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                ) : (
                  <span className="bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    {stat.staticText}
                  </span>
                )}
              </p>

              {/* Label */}
              <p className="mt-3 text-sm font-bold text-[#0F172A]">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                {stat.subLabel}
              </p>

              {/* Decorative corner accent on hover */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-tr-2xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Honest footnote */}
        <motion.p
          className="mt-8 text-center text-xs text-slate-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Just launched — be among the first students. All facts verifiable on our{' '}
          <a href="/courses" className="text-emerald-600 hover:underline font-semibold">
            courses page
          </a>
          .
        </motion.p>
      </div>
    </section>
  )
}
