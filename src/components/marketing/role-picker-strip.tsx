'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useUserRole, type UserRole } from '@/lib/hooks/use-user-role'

const OPTIONS: Array<{ role: UserRole; emoji: string; label: string }> = [
  { role: 'professional', emoji: '💼', label: 'Pro' },
  { role: 'student',      emoji: '🎓', label: 'Student' },
  { role: 'biz-owner',    emoji: '🚀', label: 'Founder' },
  { role: 'freelancer',   emoji: '🎨', label: 'Freelancer' },
]

// Soft, dismissible role picker that sits just under the hero sub.
// Hidden once a role is set — the SYSTEM HUD chip then signals state
// and offers ✕ to revert (which re-shows this strip).
export function RolePickerStrip() {
  const { role, setRole } = useUserRole()
  return (
    <AnimatePresence>
      {!role && (
        <motion.div
          key="role-picker"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-emerald-200">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Tap to personalise →
          </span>
          {OPTIONS.map(({ role: r, emoji, label }) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="cursor-pointer rounded-full border border-emerald-400/40 bg-emerald-500/[0.12] px-3.5 py-1.5 text-xs font-semibold text-emerald-50
                         shadow-[0_0_12px_rgba(16,185,129,0.18)]
                         transition-all duration-200 ease-out
                         hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-400/25 hover:text-white
                         hover:shadow-[0_0_22px_rgba(16,185,129,0.55)]
                         active:translate-y-0 active:scale-[0.97]
                         focus:outline-none focus-visible:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              <span className="mr-1.5">{emoji}</span>{label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
