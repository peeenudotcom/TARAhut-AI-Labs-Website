import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms and conditions governing your use of ${siteConfig.name} courses and services.`,
}

const lastUpdated = 'April 10, 2026'

export default function TermsPage() {
  return (
    <>
      {/* Dark Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: '#020617' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[15%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(16,185,129,0.10)' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <article className="bg-[#0A0F1C] pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 blog-content text-gray-300 leading-relaxed [prose prose-invert prose-emerald_h2]:text-white [prose prose-invert prose-emerald_h2]:text-xl [prose prose-invert prose-emerald_h2]:font-bold [prose prose-invert prose-emerald_h2]:mt-8 [prose prose-invert prose-emerald_h2]:mb-3 [prose prose-invert prose-emerald_p]:text-gray-400 [prose prose-invert prose-emerald_p]:mb-4 [prose prose-invert prose-emerald_p]:leading-relaxed [prose prose-invert prose-emerald_ul]:text-gray-400 [prose prose-invert prose-emerald_ul]:my-3 [prose prose-invert prose-emerald_ul]:pl-5 [prose prose-invert prose-emerald_li]:mb-2 [prose prose-invert prose-emerald_a]:text-emerald-400 [prose prose-invert prose-emerald_a]:hover:underline [prose prose-invert prose-emerald_strong]:text-white">
          <p>
            Welcome to {siteConfig.name}. These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of our website and the courses, content, and services we provide. By accessing our website or enrolling in any course, you agree to be bound by these Terms.
          </p>

          <h2>1. About Us</h2>
          <p>
            {siteConfig.name} is an educational service operated from {siteConfig.contact.fullAddress}, offering training programs in artificial intelligence tools, prompt engineering, automation, and related technologies.
          </p>

          <h2>2. Course Enrollment</h2>
          <ul>
            <li>Enrollment is confirmed upon successful payment processing via Razorpay</li>
            <li>Course access, batch dates, and delivery methods are communicated at the time of enrollment</li>
            <li>We reserve the right to reschedule batches with prior notice</li>
            <li>Minimum age and prerequisites, if any, are mentioned on the course page</li>
          </ul>

          <h2>3. Payments</h2>
          <ul>
            <li>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise</li>
            <li>Payments are processed securely through Razorpay; we do not store card or UPI details</li>
            <li>Payment confirmation is sent via email and WhatsApp</li>
            <li>In case of payment failure, please contact support with transaction details</li>
          </ul>

          <h2>4. Cancellation &amp; Refunds</h2>
          <p>
            Refund eligibility and process are governed by our <a href="/refund">Refund &amp; Cancellation Policy</a>. Please review that document before enrolling.
          </p>

          <h2>5. Intellectual Property</h2>
          <ul>
            <li>All course materials, videos, slides, and content are the intellectual property of {siteConfig.name}</li>
            <li>You may use the materials for your personal learning only</li>
            <li>Sharing, redistributing, reselling, or publishing our content without written permission is strictly prohibited</li>
            <li>Violation may result in immediate account termination and legal action</li>
          </ul>

          <h2>6. User Conduct</h2>
          <p>By using our services, you agree NOT to:</p>
          <ul>
            <li>Share your account credentials or enrollment with others</li>
            <li>Disrupt classes, harass instructors, or engage in abusive behavior</li>
            <li>Use automated tools (bots, scrapers) to access our website</li>
            <li>Attempt to reverse-engineer or copy our AI tools and demos</li>
            <li>Violate any applicable law or regulation</li>
          </ul>

          <h2>7. AI Tools &amp; Demos</h2>
          <p>
            Our website includes interactive AI tools and demos powered by third-party AI providers (including Anthropic Claude). Usage is subject to fair-use limits. Results are generated by AI and may contain inaccuracies. Do not rely on AI outputs for medical, legal, financial, or other critical decisions without verification.
          </p>

          <h2>8. Certificates</h2>
          <ul>
            <li>Certificates are awarded upon successful completion of all course requirements</li>
            <li>Certificates are digitally verifiable on our website</li>
            <li>We reserve the right to revoke certificates in cases of fraud or misrepresentation</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific course giving rise to the claim.
          </p>

          <h2>10. Disclaimers</h2>
          <ul>
            <li>We do not guarantee specific income outcomes, job placements, or freelance earnings</li>
            <li>Learning outcomes depend on individual effort, practice, and market conditions</li>
            <li>Course content is provided &ldquo;as is&rdquo; without warranties of any kind</li>
          </ul>

          <h2>11. Modifications</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified via email. Continued use of our services after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Punjab, India.
          </p>

          <h2>13. Contact</h2>
          <ul>
            <li><strong>Email:</strong> <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
            <li><strong>Phone/WhatsApp:</strong> {siteConfig.contact.phone}</li>
            <li><strong>Address:</strong> {siteConfig.contact.fullAddress}</li>
          </ul>
        </div>
      </article>
    </>
  )
}
