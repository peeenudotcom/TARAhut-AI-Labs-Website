'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { siteConfig } from '@/config/site'
import { getOnlineCourseLink } from '@/lib/course-mapping'

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
  batchStartingSoon?: boolean
}

type AppliedPromo = {
  code: string
  discountPercent: number
  discountAmount: number
  finalAmount: number
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
  batchStartingSoon,
}: EnrollmentCardProps) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  const [promoOpen, setPromoOpen] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [applied, setApplied] = useState<AppliedPromo | null>(null)

  // Authoritative base price for this student. Starts from the prop
  // (pricing config default) and is refreshed from /api/payment/price-quote
  // once the student enters their email — so returning customers see ₹799.
  const [basePrice, setBasePrice] = useState(price)
  const [isReturnCustomer, setIsReturnCustomer] = useState(false)

  useEffect(() => {
    setBasePrice(price)
  }, [price])

  async function refreshQuote(forEmail: string) {
    if (!forEmail.trim()) return
    try {
      const res = await fetch('/api/payment/price-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug, email: forEmail }),
      })
      if (!res.ok) return
      const q = await res.json()
      if (typeof q.basePrice === 'number') setBasePrice(q.basePrice)
      if (typeof q.isReturnCustomer === 'boolean') setIsReturnCustomer(q.isReturnCustomer)
    } catch {
      // Non-fatal — server remains authoritative at order creation.
    }
  }

  const discount = originalPrice
    ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
    : 0

  // The actual amount the student pays — either the course price, or the
  // discounted amount when a promo is applied. 0 means free unlock.
  const payableAmount = applied ? applied.finalAmount : basePrice

  // Matching self-paced online course (if one exists). Used to offer a
  // cheaper alternative to students who can't commit to the offline batch.
  const onlineLink = getOnlineCourseLink(courseSlug)

  async function handleApplyPromo() {
    if (!promoInput.trim()) return
    if (!name.trim() || !email.trim()) {
      setPromoError('Enter your name and email above first, then apply the promo.')
      return
    }
    setPromoLoading(true)
    setPromoError('')
    try {
      const res = await fetch('/api/promo/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim(),
          email,
          name,
          phone,
          courseSlug,
          courseTitle,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPromoError(data.error ?? 'Could not apply this code.')
        setPromoLoading(false)
        return
      }

      if (data.freeUnlock) {
        // 100% off path: server already recorded the redemption + free
        // purchase. Jump straight to the success state.
        setApplied({
          code: promoInput.trim().toUpperCase(),
          discountPercent: data.discountPercent,
          discountAmount: basePrice,
          finalAmount: 0,
        })
        setPaymentId(`PROMO_${promoInput.trim().toUpperCase()}`)
        setStep('success')
      } else {
        // Partial discount: server returned authoritative numbers — mirror them.
        if (typeof data.originalAmount === 'number') setBasePrice(data.originalAmount)
        if (typeof data.isReturnCustomer === 'boolean') setIsReturnCustomer(data.isReturnCustomer)
        setApplied({
          code: promoInput.trim().toUpperCase(),
          discountPercent: data.discountPercent,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
        })
      }
    } catch {
      setPromoError('Something went wrong. Please try again.')
    }
    setPromoLoading(false)
  }

  function handleRemovePromo() {
    setApplied(null)
    setPromoInput('')
    setPromoError('')
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) {
      setError('Name and email are required.')
      return
    }

    // If the student typed a promo code but hasn't clicked Apply yet,
    // apply it first — this avoids them accidentally paying full price
    // (or at all, for 100% off codes).
    if (promoInput.trim() && !applied) {
      await handleApplyPromo()
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
          promoCode: applied?.code,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to create order')
      }
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
          const verifyRes = await fetch('/api/payment/verify-and-enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              courseSlug,
              courseId: courseSlug,
              courseTitle,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              amount: data.finalAmount,
              promoCode: applied?.code,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStep('form')
    }
    setLoading(false)
  }


  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="lg:self-start lg:sticky lg:top-24" data-cta="discount">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-lg">
          {/* Price header */}
          <div className="bg-gradient-to-r from-[#059669] to-[#0D9488] p-6 text-white">
            {batchStartingSoon && (
              <div className="-mt-1 mb-3 flex items-center gap-2 rounded-md border border-amber-300/40 bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-300" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                  Batch starts soon
                </span>
                <span className="text-[11px] text-white/80">· secure your seat</span>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                ₹{payableAmount.toLocaleString('en-IN')}
              </span>
              {applied ? (
                <span className="text-lg text-white/60 line-through">
                  ₹{basePrice.toLocaleString('en-IN')}
                </span>
              ) : (
                originalPrice && !isReturnCustomer && (
                  <span className="text-lg text-white/60 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )
              )}
            </div>
            {applied ? (
              <p className="mt-1 text-sm text-white/90">
                Promo <span className="font-semibold">{applied.code}</span> applied — you save ₹{applied.discountAmount.toLocaleString('en-IN')}
              </p>
            ) : isReturnCustomer ? (
              <p className="mt-1 text-sm text-white/90">
                Welcome back! Special return customer price
              </p>
            ) : (
              discount > 0 && (
                <p className="mt-1 text-sm text-white/80">
                  {discount}% off — Limited time offer
                </p>
              )
            )}
          </div>

          {/* Self-paced online alternative — cheaper path for students who
              can't (or don't want to) commit to the offline batch. */}
          {onlineLink && step !== 'success' && (
            <Link
              href={onlineLink.href}
              className="group flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#00f0ff]/5 px-6 py-3 text-sm text-[#7dd3fc] transition hover:bg-[#00f0ff]/10 hover:text-[#00f0ff]"
            >
              <span>
                <span className="font-semibold">Prefer self-paced online?</span>{' '}
                Get it for ₹{onlineLink.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          )}

          <div className="p-6">
            {step === 'success' ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {applied && applied.finalAmount === 0
                    ? 'Course Unlocked!'
                    : 'Payment Successful!'}
                </h3>
                {applied && applied.finalAmount === 0 ? (
                  <>
                    <p className="mt-2 text-sm text-gray-400">
                      Promo <span className="font-semibold text-emerald-300">{applied.code}</span> applied — you saved ₹{applied.discountAmount.toLocaleString('en-IN')}.
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Check your email for a sign-in link to set your password, then visit{' '}
                      <a href="/learn/dashboard" className="text-emerald-400 hover:underline">your dashboard</a>.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-gray-500">
                      Payment ID: {paymentId}
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Check your email for a sign-in link to set your password, then visit{' '}
                      <a href="/learn/dashboard" className="text-emerald-400 hover:underline">your dashboard</a>.
                    </p>
                  </>
                )}
                <a
                  href={`${siteConfig.links.whatsapp}?text=Hi, I just ${applied && applied.finalAmount === 0 ? 'unlocked' : 'paid for'} ${courseTitle}. ${paymentId ? `Reference: ${paymentId}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1eba57]"
                >
                  Message us on WhatsApp
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
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => refreshQuote(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  {/* Promo code */}
                  <div>
                    {!promoOpen && !applied && (
                      <button
                        type="button"
                        onClick={() => setPromoOpen(true)}
                        className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                      >
                        Have a promo code?
                      </button>
                    )}

                    {promoOpen && !applied && (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value)
                              if (promoError) setPromoError('')
                            }}
                            placeholder="Enter code"
                            className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm uppercase tracking-wider text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/10"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            disabled={!promoInput.trim() || promoLoading}
                            className="rounded-lg border border-emerald-400/40 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/10 hover:text-emerald-200 disabled:opacity-60"
                          >
                            {promoLoading ? 'Checking…' : 'Apply'}
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-xs text-red-400">{promoError}</p>
                        )}
                      </div>
                    )}

                    {applied && (
                      <div className="flex items-center justify-between rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
                        <p className="text-xs text-emerald-300">
                          <span className="font-semibold">{applied.code}</span> applied · {applied.discountPercent}% off
                        </p>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs font-medium text-gray-400 transition-colors hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

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
                        Pay ₹{payableAmount.toLocaleString('en-IN')} Now
                      </>
                    )}
                  </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-xs text-gray-600">or</span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
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

                {/* Conversion closer — small emerald link into the Lab
                    Feed for hesitant buyers. Proof beats promise at
                    the moment a card is open but the pay button
                    hasn't been clicked. */}
                <Link
                  href="/lab-feed"
                  className="group mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-200"
                >
                  <span aria-hidden className="text-sm">✦</span>
                  See what students are building this month
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=Enquiry: ${courseTitle}`}
                  className="flex w-full items-center justify-center rounded-lg border border-white/[0.08] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04]"
                >
                  Email Enquiry
                </a>

                <p className="mt-3 text-center text-xs text-gray-600">
                  Secure payment via Razorpay. UPI, Cards, Net Banking accepted.
                </p>
              </>
            )}

            {/* Course Meta */}
            <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-white">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium text-white">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-white">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Instructor</span>
                <span className="font-medium text-white">{instructorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Enrolled</span>
                <span className="font-medium text-white">{enrolledCount} students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Modules</span>
                <span className="font-medium text-white">{modulesCount} modules</span>
              </div>
              {isSchoolCourse && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Batch size</span>
                  <span className="font-medium text-emerald-400">Max 10 students</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Collection Link */}
        <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.04] p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Share this page to collect payments</p>
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.07]"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
