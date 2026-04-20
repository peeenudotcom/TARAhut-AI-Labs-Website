'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createBrowserSupabase } from '@/lib/supabase'

type Mode = 'password' | 'magic_link'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/learn/dashboard'
  const urlError = searchParams.get('error')

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    urlError === 'exchange_failed'
      ? 'That sign-in link expired or was used already. Log in with your password instead.'
      : ''
  )
  const [magicSent, setMagicSent] = useState(false)

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Full reload so server components pick up the new session cookie.
    window.location.href = nextPath
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setMagicSent(true)
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
          {magicSent ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <svg
                  className="h-8 w-8 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Check your email</h2>
              <p className="mb-6 text-gray-400">
                We sent a sign-in link to{' '}
                <span className="font-medium text-white">{email}</span>. Open it{' '}
                <span className="font-medium text-white">in this same browser</span>{' '}
                so the session can complete.
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Didn&apos;t receive it? Check spam, or{' '}
                <button
                  onClick={() => {
                    setMagicSent(false)
                    setMode('password')
                  }}
                  className="text-emerald-400 hover:underline"
                >
                  sign in with password instead
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-white">Log in</h1>
              <p className="mb-8 text-gray-400">
                Welcome back to TARAhut AI Labs.
              </p>

              {/* Mode toggle */}
              <div className="mb-6 flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('password')
                    setError('')
                  }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    mode === 'password'
                      ? 'bg-white/[0.08] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('magic_link')
                    setError('')
                  }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    mode === 'magic_link'
                      ? 'bg-white/[0.08] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Magic link
                </button>
              </div>

              {mode === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
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

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="block text-sm text-gray-400">Password</label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
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
                    {loading ? 'Signing in…' : 'Log in'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
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
                    {loading ? 'Sending…' : 'Send magic link'}
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Open the link in this same browser. Password login is more reliable.
                  </p>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-gray-500">
                New here?{' '}
                <Link href="/signup" className="text-emerald-400 hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
