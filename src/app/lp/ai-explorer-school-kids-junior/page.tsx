import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { KidsLandingContent } from '@/components/landing/kids-landing-content';

export const metadata: Metadata = {
  title: 'AI Kids Lab (Class 5–7) — Start Your AI Adventure | TARAhut AI Labs',
  description:
    'The Playful Lab for Class 5–7. 4 weeks, hands-on AI storytelling, art, and mini science projects — safe, supervised, in-person in Kotkapura, Punjab.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'ai-explorer-school-kids-junior');
  if (!course) notFound();

  return <KidsLandingContent course={course} />;
}
