import { HeroSection } from '@/components/marketing/hero-section'
import { StatsCounter } from '@/components/marketing/stats-counter'
import { CourseHighlights } from '@/components/marketing/course-highlights'
import { WhyUplrn } from '@/components/marketing/why-uplrn'
import { ToolsShowcase } from '@/components/marketing/tools-showcase'
import { TestimonialsSection } from '@/components/marketing/testimonials-section'
import { CommunitySection } from '@/components/marketing/community-section'
import { NewsletterSection } from '@/components/marketing/newsletter-section'
import { PartnerBanner } from '@/components/marketing/partner-banner'
import { FaqSection } from '@/components/marketing/faq-section'
import { FreeLessonCta } from '@/components/marketing/free-lesson-cta'
import { CtaSection } from '@/components/marketing/cta-section'
import { EnrollmentToast } from '@/components/landing/enrollment-toast'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <CourseHighlights />
      <FreeLessonCta />
      <WhyUplrn />
      <ToolsShowcase />
      <TestimonialsSection />
      <CommunitySection />
      <NewsletterSection />
      <PartnerBanner />
      <FaqSection />
      <CtaSection />
      <EnrollmentToast />
    </>
  )
}
