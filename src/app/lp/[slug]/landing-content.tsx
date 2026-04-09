'use client'

import { useState } from 'react'
import Script from 'next/script'
import { motion } from 'framer-motion'
import type { Course } from '@/config/courses'
import { siteConfig } from '@/config/site'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success'

export function LandingPageContent({ course }: { course: Course }) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) {
      setError('Name and email are required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Create order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug: course.slug,
          courseTitle: course.title,
          amount: course.price,
        }),
      })

      if (!res.ok) throw new Error('Failed to create order')
      const data = await res.json()

      setStep('paying')

      // Open Razorpay
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: siteConfig.name,
        description: course.title,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: '#059669' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              courseSlug: course.slug,
              courseTitle: course.title,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              amount: course.price,
            }),
          })

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json()
            setPaymentId(verifyData.paymentId)
            setStep('success')
          } else {
            setError('Payment verification failed. Contact us on WhatsApp.')
            setStep('form')
          }
        },
        modal: {
          ondismiss: () => {
            setStep('form')
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
    }

    setLoading(false)
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to enroll in "${course.title}" at Uplrn AI Labs.`
  )

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* No header/footer — clean landing page */}
      <div className="min-h-screen bg-[#020617]">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
              style={{ background: 'rgba(16,185,129,0.10)' }}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-24">
            {/* Logo */}
            <div className="text-center mb-8 md:mb-12">
              <span className="text-base md:text-lg font-semibold text-white">Uplrn AI Labs</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-xs md:text-sm text-gray-400">Punjab&apos;s First AI Training Center</span>
            </div>

            {/* Mobile: form first (sticky), Desktop: course info left + form right */}
            <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Left: Course info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {course.isNew && (
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-medium mb-4">
                    NEW COURSE
                  </span>
                )}

                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
                  {course.title}
                </h1>

                <p className="mt-4 text-base md:text-lg text-gray-400 leading-relaxed">
                  {course.description}
                </p>

                {/* Key stats */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { label: 'Duration', value: course.duration },
                    { label: 'Level', value: course.level },
                    { label: 'Students', value: `${course.studentsEnrolled}+` },
                    { label: 'Rating', value: `${course.rating}/5` },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-white font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* What you'll learn */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    What you&apos;ll learn
                  </h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.slice(0, 5).map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <svg
                          className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Tools you&apos;ll master
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: Enrollment form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:sticky md:top-8"
              >
                <div id="enroll-form" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                  {step === 'success' ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Payment Successful!
                      </h2>
                      <p className="text-gray-400 mb-2">
                        Welcome to {course.title}!
                      </p>
                      <p className="text-xs text-gray-500 mb-6">
                        Payment ID: {paymentId}
                      </p>
                      <p className="text-gray-400 text-sm mb-6">
                        We&apos;ll contact you on WhatsApp within 2 hours with your batch details and login credentials.
                      </p>
                      <a
                        href={`https://wa.me/919915424411?text=${encodeURIComponent(`Hi, I just enrolled in "${course.title}". My payment ID is ${paymentId}. Please share my batch details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Message Us on WhatsApp
                      </a>
                    </div>
                  ) : (
                    <>
                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3">
                          {course.originalPrice && (
                            <span className="text-xl text-gray-500 line-through">
                              ₹{course.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-4xl font-bold text-white">
                            ₹{course.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {course.originalPrice && (
                          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium">
                            Save ₹{(course.originalPrice - course.price).toLocaleString('en-IN')} — Limited Time
                          </span>
                        )}
                      </div>

                      <form onSubmit={handleEnroll} className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1.5">Phone (WhatsApp)</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 99154 24411"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-400 focus:outline-none transition-colors"
                          />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                          type="submit"
                          disabled={loading || step === 'paying'}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-black font-semibold text-lg shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {loading || step === 'paying'
                            ? 'Processing...'
                            : `Enroll Now — ₹${course.price.toLocaleString('en-IN')}`}
                        </button>
                      </form>

                      <div className="mt-4 text-center">
                        <a
                          href={`https://wa.me/919915424411?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                        >
                          Have questions? Ask on WhatsApp →
                        </a>
                      </div>

                      {/* Trust signals */}
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure Payment
                          </span>
                          <span>•</span>
                          <span>{siteConfig.stats.studentsCount} Students</span>
                          <span>•</span>
                          <span>Certificate Included</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Syllabus */}
        <section className="py-16 bg-[#0B1120]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Course Syllabus
            </h2>
            <div className="space-y-4">
              {course.syllabus.map((mod, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-white mb-3">{mod.module}</h3>
                  <ul className="space-y-2">
                    {mod.topics.map((topic, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-emerald-400 mt-1">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials placeholder */}
        <section className="py-16 bg-[#020617]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">
              What Our Students Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Raman K.',
                  role: 'Business Owner, Ludhiana',
                  text: 'I learned more about AI in 15 days than I did in months of YouTube videos. The hands-on approach made all the difference.',
                },
                {
                  name: 'Priya S.',
                  role: 'Marketing Professional',
                  text: 'The CRISP framework changed how I use AI at work. My productivity has increased 3x since completing this course.',
                },
                {
                  name: 'Arjun M.',
                  role: 'Freelancer, Chandigarh',
                  text: 'Started freelancing with AI skills within a week of completing the course. Already earning ₹25K/month.',
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 text-left"
                >
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <p className="text-white font-medium text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#0B1120]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Do I need any prior experience?', a: 'No. This course starts from the basics. All you need is a laptop and internet connection.' },
                { q: 'Is this online or offline?', a: 'Currently offline at our center in Kotkapura, Punjab. Online batches coming soon.' },
                { q: 'Will I get a certificate?', a: 'Yes. You receive a verified certificate on completion that you can share on LinkedIn.' },
                { q: 'What if I miss a class?', a: 'We provide recorded sessions and notes. You can catch up at your own pace.' },
                { q: 'Can I pay in installments?', a: 'Contact us on WhatsApp to discuss installment options.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-medium text-white text-sm">{faq.q}</h3>
                  <p className="mt-2 text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-[#020617]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Master AI?
            </h2>
            <p className="text-gray-400 mb-8">
              Join {siteConfig.stats.studentsCount} students who are already building their AI careers.
            </p>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-black font-semibold text-lg shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:scale-105 transition-all duration-300"
            >
              Enroll Now — ₹{course.price.toLocaleString('en-IN')}
            </a>
          </div>
        </section>

        {/* Minimal footer */}
        <footer className="py-6 pb-24 md:pb-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            {siteConfig.name} &middot; {siteConfig.contact.address} &middot; {siteConfig.contact.phone}
          </p>
        </footer>

        {/* Mobile sticky CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#020617]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 line-through mr-2">
              ₹{course.originalPrice?.toLocaleString('en-IN')}
            </span>
            <span className="text-lg font-bold text-white">
              ₹{course.price.toLocaleString('en-IN')}
            </span>
          </div>
          <a
            href="#enroll-form"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('enroll-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold text-sm"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </>
  )
}
