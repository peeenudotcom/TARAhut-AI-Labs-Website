import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PowerLandingContent } from '@/components/landing/power-landing-content';

export const metadata: Metadata = {
  title: 'AI Power 8-Week Program — Erase the Inefficiency | TARAhut AI Labs',
  description:
    'The Executive Performance Lab. Master the professional AI stack in 8 weeks. Deploy custom workflows that reclaim 20+ hours of your work week. Offline in Kotkapura.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'ai-power-8-week-program');
  if (!course) notFound();

  return <PowerLandingContent course={course} />;
}
