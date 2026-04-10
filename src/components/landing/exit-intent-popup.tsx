'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ExitIntentPopupProps {
  courseTitle: string
  courseSlug: string
  primaryColor?: string
}

export function ExitIntentPopup({ courseTitle, courseSlug, primaryColor = '#059669' }: ExitIntentPopupProps) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  useEffect(() => {
    if (shown) return
    if (typeof window === 'undefined') return

    // Only show once per session per course
    const key = `exit_shown_${courseSlug}`
    if (sessionStorage.getItem(key)) {
      setShown(true)
      return
    }

    let triggered = false
    const trigger = () => {
      if (triggered) return
      triggered = true
      setOpen(true)
      setShown(true)
      sessionStorage.setItem(key, '1')
    }

    // Desktop: mouse leaves the top of the viewport
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger()
    }

    // Mobile fallback: after 45 seconds OR scroll to bottom
    const timeoutId = setTimeout(trigger, 45000)
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      if (scrolled >= document.body.scrollHeight - 100) trigger()
    }

    document.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [shown, courseSlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return
    setStatus('submitting')
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: `${phone.replace(/\D/g, '')}@placeholder.tarahutailabs.com`,
          phone,
          courseInterest: courseTitle,
          message: `Exit-intent lead for ${courseTitle}`,
          website, // honeypot
        }),
      })
      setStatus('done')
      setTimeout(() => setOpen(false), 2500)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 md:p-8 shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {status !== 'done' ? (
              <>
                <div className="mb-2">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    Wait! Don&apos;t leave yet
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                  Get the full curriculum<br />
                  <span style={{ color: primaryColor }}>on WhatsApp.</span>
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Not ready to enroll? No problem. We&apos;ll send you the complete curriculum, next batch dates, and answer any questions. No spam, promise.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp number (e.g., 98765 43210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9\s+\-]{10,15}"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3 rounded-xl text-white font-bold text-base transition-transform hover:scale-[1.02] disabled:opacity-60"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {status === 'submitting' ? 'Sending...' : '📱 Send Me Details on WhatsApp'}
                  </button>
                </form>
                <p className="text-center text-xs text-gray-600 mt-3">
                  We&apos;ll text you within 24 hours.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Got it!</h3>
                <p className="text-gray-400 text-sm">We&apos;ll WhatsApp you the details shortly.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
