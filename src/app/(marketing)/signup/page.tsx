'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createBrowserSupabase } from '@/lib/supabase'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<
    | { kind: 'check_email' }
    | { kind: 'signed_in' }
    | null
  >(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Name, email, and a password of at least 6 characters are required.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createBrowserSupabase()
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim() || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/learn/dashboard`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Supabase returns a session immediately when email confirmation is
    // disabled. When confirmation is required (default), session is null
    // and a confirmation email is sent.
    if (data.session) {
      setDone({ kind: 'signed_in' })
      // Full reload so server components pick up the new session cookie.
      window.location.href = '/learn/dashboard'
    } else {
      setDone({ kind: 'check_email' })
    }

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
          {!done ? (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-white">Create your account</h1>
              <p className="mb-8 text-gray-400">
                Set up your TARAhut AI Labs account — one time, then log in with email + password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-emerald-400 focus:outline-none"
                  />
                </div>

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
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Phone <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    minLength={6}
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
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-400 hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : done.kind === 'check_email' ? (
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
              <h2 className="mb-2 text-xl font-semibold text-white">Confirm your email</h2>
              <p className="mb-6 text-gray-400">
                We sent a confirmation link to{' '}
                <span className="font-medium text-white">{email}</span>. Click the
                link to activate your account, then log in.
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Didn&apos;t receive it? Check your spam folder.
              </p>
              <Link
                href="/login"
                className="text-sm text-emerald-400 hover:underline"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-400">Signing you in…</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
