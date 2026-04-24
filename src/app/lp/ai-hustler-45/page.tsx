import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HustlerLandingContent } from '@/components/landing/hustler-landing-content';

export const metadata: Metadata = {
  title: 'AI Hustler 45 — First Paying Client in 45 Days | TARAhut AI Labs',
  description:
    'High-velocity freelancing sprint for Punjab hustlers. 45 days, 15+ AI tools, 25+ real businesses, first paying client. ₹7,999 — limited seats.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'ai-hustler-45');
  if (!course) notFound();

  return <HustlerLandingContent course={course} />;
}
