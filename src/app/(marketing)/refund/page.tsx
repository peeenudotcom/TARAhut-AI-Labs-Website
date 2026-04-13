import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: `${siteConfig.name} refund and cancellation policy for course enrollments.`,
}

const lastUpdated = 'April 10, 2026'

export default function RefundPolicyPage() {
  return (
    <>
      {/* Dark Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: '#020617' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[15%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(16,185,129,0.10)' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Refund &amp; Cancellation Policy</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <article className="bg-[#0A0F1C] pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 blog-content text-gray-300 leading-relaxed [prose prose-invert prose-emerald_h2]:text-white [prose prose-invert prose-emerald_h2]:text-xl [prose prose-invert prose-emerald_h2]:font-bold [prose prose-invert prose-emerald_h2]:mt-8 [prose prose-invert prose-emerald_h2]:mb-3 [prose prose-invert prose-emerald_p]:text-gray-400 [prose prose-invert prose-emerald_p]:mb-4 [prose prose-invert prose-emerald_p]:leading-relaxed [prose prose-invert prose-emerald_ul]:text-gray-400 [prose prose-invert prose-emerald_ul]:my-3 [prose prose-invert prose-emerald_ul]:pl-5 [prose prose-invert prose-emerald_li]:mb-2 [prose prose-invert prose-emerald_a]:text-emerald-400 [prose prose-invert prose-emerald_a]:hover:underline [prose prose-invert prose-emerald_strong]:text-white">
          <p>
            At {siteConfig.name}, we stand behind the quality of our courses. This policy explains how refunds and cancellations are handled for all paid enrollments.
          </p>

          <h2>1. Cooling-Off Period (Full Refund)</h2>
          <p>
            You may cancel your enrollment and receive a <strong>100% refund</strong> within <strong>48 hours</strong> of payment, provided:
          </p>
          <ul>
            <li>The course batch has not started</li>
            <li>You have not accessed more than one live session or recorded lesson</li>
            <li>You have not downloaded any paid materials or resources</li>
          </ul>

          <h2>2. Partial Refund Window</h2>
          <p>
            Between 48 hours and 7 days of payment, OR before the second live session of your batch (whichever is earlier), you may request a <strong>50% refund</strong>.
          </p>

          <h2>3. No Refund After</h2>
          <p>Refunds are NOT available in the following cases:</p>
          <ul>
            <li>After 7 days from the date of payment</li>
            <li>After attending the second live session of your batch</li>
            <li>After accessing more than 25% of the course materials</li>
            <li>If you violate our <a href="/terms">Terms &amp; Conditions</a> or are removed from the course for misconduct</li>
            <li>For short-term courses (less than 7 days in duration) after the first session</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <ol>
            <li>
              Email us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> OR message us on WhatsApp at {siteConfig.contact.phone}
            </li>
            <li>Include your full name, registered phone/email, course name, payment transaction ID, and reason for refund</li>
            <li>We will acknowledge your request within 24 hours and process eligible refunds within 5-7 business days</li>
            <li>Refunds are credited to the original payment method</li>
          </ol>

          <h2>5. Batch Rescheduling</h2>
          <p>
            If we cancel or reschedule a batch due to unforeseen circumstances, you may choose to:
          </p>
          <ul>
            <li>Move to the next available batch at no extra cost</li>
            <li>Receive a full refund regardless of how much time has passed</li>
          </ul>

          <h2>6. Course Transfer</h2>
          <p>
            Instead of a refund, you may request a one-time transfer to a different course of equal or higher value (you pay the difference). This option is available within the same refund window as above.
          </p>

          <h2>7. Payment Gateway Charges</h2>
          <p>
            In most cases, Razorpay processing fees (typically 2-3%) are non-refundable and may be deducted from the refund amount. This is clearly communicated at the time of refund processing.
          </p>

          <h2>8. Special Cases</h2>
          <ul>
            <li><strong>Medical emergency:</strong> We may extend the refund window on a case-by-case basis with valid documentation</li>
            <li><strong>Technical issues preventing access:</strong> If you cannot attend due to our technical failure, full refund is available</li>
            <li><strong>Duplicate payment:</strong> Automatically refunded within 2-3 business days</li>
          </ul>

          <h2>9. Kids Courses (Class 5-10)</h2>
          <p>
            For courses involving minors, refund requests must be made by the parent or guardian. The same refund window applies. We offer a goodwill reschedule option for children who feel the course is not a right fit within the first two sessions.
          </p>

          <h2>10. Contact for Refund Requests</h2>
          <ul>
            <li><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
            <li><strong>WhatsApp:</strong> {siteConfig.contact.phone}</li>
            <li><strong>Response time:</strong> Within 24 hours on business days</li>
          </ul>

          <p className="mt-8 text-sm text-gray-500">
            We aim to resolve all refund requests fairly and promptly. If you are not satisfied with our response, you may escalate the issue by emailing us with subject line &ldquo;Escalation&rdquo;.
          </p>
        </div>
      </article>
    </>
  )
}
