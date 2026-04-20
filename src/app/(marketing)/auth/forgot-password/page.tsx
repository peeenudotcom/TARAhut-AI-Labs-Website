'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createBrowserSupabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      }
    )

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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
          {sent ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <svg
                  className="h-8 w-8 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Check your email</h2>
              <p className="mb-6 text-gray-400">
                If an account exists for{' '}
                <span className="font-medium text-white">{email}</span>, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login" className="text-sm text-emerald-400 hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-white">Reset your password</h1>
              <p className="mb-8 text-gray-400">
                Enter the email you signed up with. We&apos;ll send a link to set a new password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Remembered it?{' '}
                <Link href="/login" className="text-emerald-400 hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
