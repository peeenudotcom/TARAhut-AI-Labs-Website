'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Enrollment {
  id: number
  name: string
  city: string
  course: string
  timeAgo: string
}

// Static fallback so there's always something to show before the
// first real enrollment. Kotkapura-first to match the lab's actual
// locality; the API route is the source of truth once payments
// start flowing.
const FALLBACK_ENROLLMENTS: Enrollment[] = [
  { id: 1, name: 'Jashandeep S.', city: 'Kotkapura', course: 'Master AI Builder', timeAgo: '2 min ago' },
  { id: 2, name: 'Simran K.', city: 'Bathinda', course: 'Master Claude 15 Days', timeAgo: '7 min ago' },
  { id: 3, name: 'Rahul S.', city: 'Moga', course: 'AI Hustler 45', timeAgo: '12 min ago' },
  { id: 4, name: 'Neha M.', city: 'Ferozepur', course: 'AI Power 8-Week', timeAgo: '19 min ago' },
  { id: 5, name: 'Arjun P.', city: 'Kotkapura', course: 'AI Tools Mastery', timeAgo: '24 min ago' },
  { id: 6, name: 'Kavya R.', city: 'Faridkot', course: 'AI Digital Marketing', timeAgo: '31 min ago' },
]

export function EnrollmentToast() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(FALLBACK_ENROLLMENTS)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  // Fetch real enrollments on mount; fall back to static if none
  useEffect(() => {
    let mounted = true
    fetch('/api/recent-enrollments')
      .then((r) => r.json())
      .then((data: { enrollments: Enrollment[] }) => {
        if (mounted && data.enrollments && data.enrollments.length >= 3) {
          setEnrollments(data.enrollments)
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  // Rotation: first toast after 8s, then every 15s, shown for 5s each
  useEffect(() => {
    const firstDelay = setTimeout(() => setVisible(true), 8000)
    return () => clearTimeout(firstDelay)
  }, [])

  useEffect(() => {
    if (!visible) return
    const hide = setTimeout(() => setVisible(false), 5000)
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % enrollments.length)
      setVisible(true)
    }, 15000)
    return () => {
      clearTimeout(hide)
      clearTimeout(next)
    }
  }, [visible, index, enrollments.length])

  const current = enrollments[index]
  if (!current) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40, y: 10 }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className="fixed bottom-6 left-4 z-40 max-w-[280px] rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl p-3 flex items-center gap-3"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            {current.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-900 font-semibold truncate">
              {current.name} from {current.city}
            </p>
            <p className="text-[11px] text-slate-600 truncate">
              enrolled in {current.course}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">{current.timeAgo}</p>
          </div>
          <div className="flex-shrink-0 text-emerald-500 text-lg">✓</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
