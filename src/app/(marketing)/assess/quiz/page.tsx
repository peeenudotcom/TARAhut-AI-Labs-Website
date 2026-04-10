'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assessmentQuestions } from '@/config/assessment'
import type { AssessmentContactInfo } from '@/config/assessment'

export default function AssessQuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [contact, setContact] = useState<AssessmentContactInfo>({
    name: '',
    email: '',
    phone: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const totalSteps = assessmentQuestions.length + 1 // questions + contact form
  const isContactStep = currentStep === assessmentQuestions.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  function selectOption(questionId: number, option: string) {
    setResponses((prev) => ({ ...prev, [questionId]: option }))
    // Auto-advance after selection
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.name || !contact.email) {
      setError('Please fill in your name and email.')
      return
    }
    if (honeypot) return // bot trap

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, responses }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      const data = await res.json()
      window.location.href = `/assess/report/${data.reportId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
      setIsSubmitting(false)
    }
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

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              {isContactStep
                ? 'Almost done!'
                : `Question ${currentStep + 1} of ${assessmentQuestions.length}`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isContactStep ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                {assessmentQuestions[currentStep].question}
              </h2>

              <div className="space-y-3">
                {assessmentQuestions[currentStep].options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      selectOption(assessmentQuestions[currentStep].id, option)
                    }
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                      responses[assessmentQuestions[currentStep].id] === option
                        ? 'border-red-400 bg-red-500/10 text-red-300'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="mt-6 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                Your AI report is ready to generate
              </h2>
              <p className="text-gray-400 mb-8">
                Enter your details below and we&apos;ll create your personalized
                AI automation report in seconds.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot - hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px]"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-red-400 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-red-400 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+91 99154 24411"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-red-400 focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 px-8 py-4 rounded-xl bg-gradient-to-r from-red-400 via-red-500 to-red-500 text-black font-medium shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          fill="currentColor"
                          className="opacity-75"
                        />
                      </svg>
                      Generating Your AI Report...
                    </span>
                  ) : (
                    'Generate My Free Report →'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="block mx-auto mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Back to questions
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
