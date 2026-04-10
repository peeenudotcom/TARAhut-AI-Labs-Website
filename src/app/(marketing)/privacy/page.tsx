import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses, and protects your personal information.`,
}

const lastUpdated = 'April 10, 2026'

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 prose prose-slate">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: {lastUpdated}</p>

      <p>
        {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates {siteConfig.url}. This page informs you of our policies regarding the collection, use, and disclosure of personal information we receive from users of the site and our services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, including:</p>
      <ul>
        <li><strong>Contact details:</strong> name, email, phone number, city</li>
        <li><strong>Payment information:</strong> processed securely by Razorpay; we do not store card or UPI details on our servers</li>
        <li><strong>Course enrollment data:</strong> course selection, enrollment date, completion progress</li>
        <li><strong>Assessment responses:</strong> answers you provide to our AI assessment quizzes</li>
        <li><strong>Communication history:</strong> emails, WhatsApp messages, and support inquiries</li>
      </ul>
      <p>We also automatically collect certain information when you visit our site:</p>
      <ul>
        <li>IP address, browser type, device information, and operating system</li>
        <li>Pages visited, time spent, and navigation patterns (via Microsoft Clarity and Meta Pixel)</li>
        <li>Referring URLs and search terms</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our courses and services</li>
        <li>To process enrollments, payments, and issue certificates</li>
        <li>To communicate about classes, schedules, and support</li>
        <li>To send course updates, promotional offers, and newsletters (you can opt out anytime)</li>
        <li>To improve our website, course content, and student experience</li>
        <li>To comply with legal obligations and prevent fraud</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>We do not sell your personal information. We may share data with:</p>
      <ul>
        <li><strong>Service providers:</strong> Razorpay (payments), Supabase (database), Vercel (hosting), Anthropic (AI features), Microsoft Clarity (analytics), Meta (ads measurement)</li>
        <li><strong>Legal authorities:</strong> when required by law or to protect our rights</li>
        <li><strong>Business transfers:</strong> in connection with any merger, acquisition, or sale of assets</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We use industry-standard security measures including HTTPS encryption, secure database access with row-level security, and signed payment verification. No method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data (subject to legal obligations)</li>
        <li>Opt out of marketing communications at any time</li>
        <li>Withdraw consent for data processing</li>
      </ul>
      <p>To exercise these rights, email us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>

      <h2>6. Cookies and Tracking</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on our site. Third-party services we use include Microsoft Clarity (session recording and heatmaps) and Meta Pixel (ad conversion tracking). You can disable cookies through your browser settings, but some features may not function properly.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        Our services include courses designed for children (Class 5-10). For students under 18, we require parental consent before enrollment and collect only information necessary for the educational service. Parents have the right to review, modify, or request deletion of their child&apos;s data.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your data for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Enrollment records are kept for at least 7 years for accounting purposes.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. Changes will be posted on this page with an updated &ldquo;last updated&rdquo; date. Continued use of our services after changes constitutes acceptance.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions about this privacy policy, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
        <li><strong>Phone/WhatsApp:</strong> {siteConfig.contact.phone}</li>
        <li><strong>Address:</strong> {siteConfig.contact.address}</li>
      </ul>
    </article>
  )
}
