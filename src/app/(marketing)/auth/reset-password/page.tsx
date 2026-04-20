'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createBrowserSupabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  // User arrives here after clicking the reset link → /auth/callback →
  // session cookie is set → we redirect here. Confirm the session exists.
  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError(
          'Your reset link may have expired. Request a new one from the login page.'
        )
      }
      setSessionReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => {
      window.location.href = '/learn/dashboard'
    }, 1500)
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#020617' }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: 'rgba(16,185,129,0.08)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
        >
          {done ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Password updated</h2>
              <p className="text-gray-400">Taking you to your dashboard…</p>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-white">Set a new password</h1>
              <p className="mb-8 text-gray-400">
                Choose a password you&apos;ll remember.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    disabled={!sessionReady}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-emerald-400 focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Type it again"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    disabled={!sessionReady}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-emerald-400 focus:outline-none disabled:opacity-60"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !sessionReady}
                  className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                >
                  {loading ? 'Saving…' : 'Save new password'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                <Link href="/login" className="text-emerald-400 hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
