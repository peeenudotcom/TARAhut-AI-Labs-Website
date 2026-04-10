'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
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
        ref.current.textContent = `${latest}${suffix}`
      }
    })
    return unsubscribe
  }, [rounded, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const stats = [
  { value: 500, suffix: '+', label: 'Students Trained' },
  { value: 15, suffix: '+', label: 'AI Courses' },
  { value: 3, suffix: '', label: 'Cities' },
  { value: 85, suffix: '%', label: 'Placement Rate' },
]

export function StatsCounter() {
  return (
    <section className="border-y border-[#E2E8F0] bg-[#FEF2F2]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
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
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <p className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-[#475569]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
