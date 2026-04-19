'use client';

import { useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = 'form' | 'paying' | 'success';

export function BuyAllAccess({ price = 999, returnCustomer = false }: { price?: number; returnCustomer?: boolean }) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseSlug: 'all-access',
          courseTitle: returnCustomer ? 'All Access (Return Customer)' : 'All Access Pass — 9 Courses',
          amount: price,
        }),
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();

      setStep('paying');
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'TARAhut AI Labs',
        description: returnCustomer
          ? 'All Access Pass — Return Customer ₹799'
          : 'All Access Pass — 9 Courses, 142 Sessions',
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: '#059669' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Verify + auto-enroll
          const verifyRes = await fetch('/api/payment/verify-and-enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              studentName: name,
              studentEmail: email,
              studentPhone: phone,
              amount: price,
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
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('form');
    }
    setLoading(false);
  }

  if (step === 'success') {
    return (
      <div className="rounded-2xl border border-[#059669]/30 bg-[#059669]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#059669]/20">
          <svg className="h-8 w-8 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-[#94a3b8] mb-2">Payment ID: {paymentId}</p>
        <p className="text-[#94a3b8] mb-6">
          Check your email for a magic link to access your courses. All 9 courses are now unlocked!
        </p>
        <a
          href={`https://wa.me/919200882008?text=Hi%2C+I+just+bought+All+Access+Pass.+Payment+ID%3A+${paymentId}+Name%3A+${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1eba57] transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Confirm on WhatsApp
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
            <span className="text-4xl font-extrabold text-white">₹{price}</span>
            {!returnCustomer && (
              <span className="text-lg text-white/60 line-through">₹8,991</span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/80">
            {returnCustomer
              ? 'Welcome back! Special return customer price'
              : '9 courses · 142 sessions · All access'}
          </p>
          {!returnCustomer && (
            <p className="mt-1 text-xs text-white/60">That&apos;s ₹7 per session</p>
          )}
        </div>

        <div className="p-6">
          {/* What you get */}
          <div className="mb-6 space-y-2">
            {[
              'All 9 courses unlocked',
              '142 interactive sessions',
              'EN / Hindi / Punjabi languages',
              'Quizzes after every session',
              'Certificate on completion',
              'Lifetime access',
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

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#059669] py-4 text-base font-bold text-white shadow-lg shadow-[#059669]/25 transition hover:bg-[#047857] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Buy All Access — ₹${price}`}
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
