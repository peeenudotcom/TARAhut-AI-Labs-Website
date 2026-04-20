'use client';

import { useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success';

type AppliedPromo = {
  code: string;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
};

interface BuyCourseProps {
  courseId: string;
  courseTitle: string;
  totalSessions: number;
  price?: number;
  originalPrice?: number;
  returnCustomer?: boolean;
}

export function BuyCourse({
  courseId,
  courseTitle,
  totalSessions,
  price = 999,
  originalPrice,
  returnCustomer = false,
}: BuyCourseProps) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [applied, setApplied] = useState<AppliedPromo | null>(null);

  const payableAmount = applied ? applied.finalAmount : price;

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    if (!name.trim() || !email.trim()) {
      setPromoError('Enter your name and email above first, then apply the promo.');
      return;
    }
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch('/api/promo/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim(),
          email,
          name,
          phone,
          courseSlug: courseId,
          courseTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error ?? 'Could not apply this code.');
        setPromoLoading(false);
        return;
      }

      if (data.freeUnlock) {
        setApplied({
          code: promoInput.trim().toUpperCase(),
          discountPercent: data.discountPercent,
          discountAmount: price,
          finalAmount: 0,
        });
        setPaymentId(`PROMO_${promoInput.trim().toUpperCase()}`);
        setStep('success');
      } else {
        setApplied({
          code: promoInput.trim().toUpperCase(),
          discountPercent: data.discountPercent,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
        });
      }
    } catch {
      setPromoError('Something went wrong. Please try again.');
    }
    setPromoLoading(false);
  }

  function handleRemovePromo() {
    setApplied(null);
    setPromoInput('');
    setPromoError('');
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug: courseId,
          courseTitle,
          promoCode: applied?.code,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to create order');
      }
      const data = await res.json();

      setStep('paying');
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'TARAhut AI Labs',
        description: `${courseTitle} — ${totalSessions} Sessions`,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: '#059669' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch('/api/payment/verify-and-enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              courseId,
              courseTitle,
              amount: data.finalAmount ?? payableAmount,
              promoCode: applied?.code,
            }),
          });
          if (verifyRes.ok) {
            const d = await verifyRes.json();
            setPaymentId(d.paymentId);
            setStep('success');
          } else {
            setError('Payment verification failed. Contact us on WhatsApp.');
            setStep('form');
          }
        },
        modal: {
          ondismiss: () => {
            setStep('form');
            setLoading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('form');
    }
    setLoading(false);
  }

  if (step === 'success') {
    const isFreeUnlock = applied && applied.finalAmount === 0;
    return (
      <div className="rounded-2xl border border-[#059669]/30 bg-[#059669]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#059669]/20">
          <svg className="h-8 w-8 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {isFreeUnlock ? 'Course Unlocked!' : 'Payment Successful!'}
        </h3>
        {isFreeUnlock ? (
          <p className="text-[#94a3b8] mb-2">
            Promo <span className="font-semibold text-[#059669]">{applied.code}</span> applied — you saved ₹{applied.discountAmount.toLocaleString('en-IN')}.
          </p>
        ) : (
          <p className="text-[#94a3b8] mb-2">Payment ID: {paymentId}</p>
        )}
        <p className="text-[#94a3b8] mb-6">
          Check your email for a sign-in link to set your password, then open{' '}
          <a href="/learn/dashboard" className="text-[#059669] underline">your dashboard</a>{' '}
          — {courseTitle} is ready.
        </p>
        <a
          href={`https://wa.me/919200882008?text=Hi%2C+I+just+${isFreeUnlock ? 'unlocked' : 'bought'}+${encodeURIComponent(courseTitle)}.+${paymentId ? `Reference%3A+${paymentId}` : ''}+Name%3A+${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1eba57] transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] overflow-hidden">
        {/* Price header */}
        <div className="bg-gradient-to-r from-[#059669] to-[#0D9488] p-6 text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-extrabold text-white">₹{payableAmount}</span>
            {applied ? (
              <span className="text-lg text-white/60 line-through">₹{price}</span>
            ) : (
              !returnCustomer && originalPrice && (
                <span className="text-lg text-white/60 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              )
            )}
          </div>
          {applied ? (
            <p className="mt-1 text-sm text-white/90">
              Promo <span className="font-semibold">{applied.code}</span> applied — you save ₹{applied.discountAmount.toLocaleString('en-IN')}
            </p>
          ) : (
            <p className="mt-1 text-sm text-white/80">
              {returnCustomer
                ? 'Welcome back! Special return customer price'
                : `${courseTitle} · ${totalSessions} sessions`}
            </p>
          )}
          {!applied && !returnCustomer && (
            <p className="mt-1 text-xs text-white/60">That&apos;s ₹{Math.round(price / totalSessions)} per session</p>
          )}
        </div>

        <div className="p-6">
          {/* What you get */}
          <div className="mb-6 space-y-2">
            {[
              `${totalSessions} interactive sessions`,
              'EN / Hindi / Punjabi languages',
              'Quizzes after every session',
              'Certificate on completion',
              'Lifetime access',
              'Learn at your own pace',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[#94a3b8]">{item}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handlePayment} className="space-y-3">
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#1e1e3a] bg-[#06060e] px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#059669] focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#1e1e3a] bg-[#06060e] px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#059669] focus:outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone / WhatsApp (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-[#1e1e3a] bg-[#06060e] px-4 py-3 text-sm text-white placeholder:text-[#94a3b8]/50 focus:border-[#059669] focus:outline-none"
            />

            {/* Promo code */}
            <div>
              {!promoOpen && !applied && (
                <button
                  type="button"
                  onClick={() => setPromoOpen(true)}
                  className="text-xs font-medium text-[#059669] transition-colors hover:text-[#10b981]"
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
                        setPromoInput(e.target.value);
                        if (promoError) setPromoError('');
                      }}
                      placeholder="Enter code"
                      className="flex-1 rounded-lg border border-[#1e1e3a] bg-[#06060e] px-3 py-2 text-sm uppercase tracking-wider text-white placeholder:text-[#94a3b8]/50 focus:border-[#059669] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim() || promoLoading}
                      className="rounded-lg border border-[#059669]/40 px-3 py-2 text-xs font-semibold text-[#059669] transition-colors hover:bg-[#059669]/10 disabled:opacity-60"
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
                <div className="flex items-center justify-between rounded-lg border border-[#059669]/40 bg-[#059669]/10 px-3 py-2">
                  <p className="text-xs text-[#059669]">
                    <span className="font-semibold">{applied.code}</span> applied · {applied.discountPercent}% off
                  </p>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-medium text-[#94a3b8] transition-colors hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#059669] py-4 text-base font-bold text-white shadow-lg shadow-[#059669]/25 transition hover:bg-[#047857] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Buy Course — ₹${payableAmount}`}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#94a3b8]/60">
            Secure payment via Razorpay. Instant access after payment.
          </p>
        </div>
      </div>
    </>
  );
}
