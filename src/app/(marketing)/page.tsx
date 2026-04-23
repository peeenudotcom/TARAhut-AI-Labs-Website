import { HeroSection } from '@/components/marketing/hero-section'
import { StatsCounter } from '@/components/marketing/stats-counter'
import { CourseHighlights } from '@/components/marketing/course-highlights'
import { WhyTarahut } from '@/components/marketing/why-tarahut'
import { ToolsShowcase } from '@/components/marketing/tools-showcase'
import { TestimonialsSection } from '@/components/marketing/testimonials-section'
import { CommunitySection } from '@/components/marketing/community-section'
import { NewsletterSection } from '@/components/marketing/newsletter-section'
import { PartnerBanner } from '@/components/marketing/partner-banner'
import { FaqSection } from '@/components/marketing/faq-section'
import { FreeLessonCta } from '@/components/marketing/free-lesson-cta'
import { CtaSection } from '@/components/marketing/cta-section'
import { CareerArchitect } from '@/components/marketing/career-architect'
import { EnrollmentToast } from '@/components/landing/enrollment-toast'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      {/* Lab connectors — soft emerald auras seeded between sections
          so the page feels continuously lit by the AI Galaxy at the
          top, not a stack of detached cards. Pure CSS via globals
          (.lab-connector). Zero-height — doesn't affect layout. */}
      <div className="lab-connector" aria-hidden />
      <CourseHighlights />
      <FreeLessonCta />
      <div className="lab-connector" aria-hidden />
      <WhyTarahut />
      <ToolsShowcase />
      <div className="lab-connector" aria-hidden />
      <TestimonialsSection />
      <CommunitySection />
      <div className="lab-connector" aria-hidden />
      <NewsletterSection />
      <PartnerBanner />
      <FaqSection />
      {/* AI Career Architect — lead magnet right above the footer.
          Turns the last scroll before the footer into an interactive
          "TARA designs your path" moment rather than a passive CTA. */}
      <CareerArchitect />
      <CtaSection />
      <EnrollmentToast />
    </>
  )
}
