'use client'

import { useState } from 'react'
import Script from 'next/script'
import { siteConfig } from '@/config/site'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type Step = 'form' | 'paying' | 'success'

interface EnrollmentCardProps {
  courseSlug: string
  courseTitle: string
  price: number
  originalPrice?: number
  duration: string
  level: string
  category: string
  instructorName: string
  enrolledCount: string
  modulesCount: number
  isSchoolCourse: boolean
}

export function EnrollmentCard({
  courseSlug,
  courseTitle,
  price,
  originalPrice,
  duration,
  level,
  category,
  instructorName,
  enrolledCount,
  modulesCount,
  isSchoolCourse,
}: EnrollmentCardProps) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) {
      setError('Name and email are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug,
          courseTitle,
          amount: price,
        }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const data = await res.json()
      setStep('paying')
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: siteConfig.name,
        description: courseTitle,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: '#059669' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              courseSlug,
              courseTitle,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              amount: price,
            }),
          })
          if (verifyRes.ok) {
            const d = await verifyRes.json()
            setPaymentId(d.paymentId)
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

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="lg:self-start lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
          {/* Price header */}
          <div className="bg-gradient-to-r from-[#059669] to-[#0D9488] p-6 text-white">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-lg text-white/60 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="mt-1 text-sm text-white/80">
                {discount}% off — Limited time offer
              </p>
            )}
          </div>

          <div className="p-6">
            {step === 'success' ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FAE5]">
                  <svg className="h-6 w-6 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Payment Successful!</h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  Payment ID: {paymentId}
                </p>
                <p className="mt-2 text-sm text-[#475569]">
                  We&apos;ll send your course access details to your email shortly.
                </p>
                <a
                  href={`${siteConfig.links.whatsapp}?text=Hi, I just paid for ${courseTitle}. Payment ID: ${paymentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1eba57]"
                >
                  Share on WhatsApp for faster access
                </a>
              </div>
            ) : (
              <>
                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669]"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669]"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669]"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || step === 'paying'}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#059669] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#047857] disabled:opacity-60"
                  >
                    {loading || step === 'paying' ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay ₹{price.toLocaleString('en-IN')} Now
                      </>
                    )}
                  </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E2E8F0]" />
                  <span className="text-xs text-[#94A3B8]">or</span>
                  <div className="h-px flex-1 bg-[#E2E8F0]" />
                </div>

                {/* WhatsApp */}
                <a
                  href={`${siteConfig.links.whatsapp}?text=Hi, I'm interested in the ${courseTitle} course.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1eba57]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Enroll via WhatsApp
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Enquiry: ${courseTitle}`}
                  className="flex w-full items-center justify-center rounded-lg border border-[#E2E8F0] px-6 py-3 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                >
                  Email Enquiry
                </a>

                <p className="mt-3 text-center text-xs text-[#94A3B8]">
                  Secure payment via Razorpay. UPI, Cards, Net Banking accepted.
                </p>
              </>
            )}

            {/* Course Meta */}
            <div className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Duration</span>
                <span className="font-medium text-[#0F172A]">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Level</span>
                <span className="font-medium text-[#0F172A]">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Category</span>
                <span className="font-medium text-[#0F172A]">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Instructor</span>
                <span className="font-medium text-[#0F172A]">{instructorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Enrolled</span>
                <span className="font-medium text-[#0F172A]">{enrolledCount} students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Modules</span>
                <span className="font-medium text-[#0F172A]">{modulesCount} modules</span>
              </div>
              {isSchoolCourse && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Batch size</span>
                  <span className="font-medium text-[#059669]">Max 10 students</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Collection Link */}
        <div className="mt-4 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
          <p className="text-xs text-[#64748B] mb-2">Share this page to collect payments</p>
          <CopyLinkButton courseSlug={courseSlug} />
        </div>
      </div>
    </>
  )
}

function CopyLinkButton({ courseSlug }: { courseSlug: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url = `${window.location.origin}/courses/${courseSlug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#0F172A] transition-colors hover:bg-[#F1F5F9]"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Copy Payment Link
        </>
      )}
    </button>
  )
}
