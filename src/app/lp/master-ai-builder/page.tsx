import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BuilderLandingContent } from '@/components/landing/builder-landing-content';

export const metadata: Metadata = {
  title: 'Master AI Builder — Deploy Real AI Systems in 90 Days | TARAhut AI Labs',
  description:
    'The Systems Architect tier. Build custom agents, no-code apps, and RAG-powered production systems for real businesses. 90 days, 20+ tools, 50+ artifacts, one capstone deploy.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'master-ai-builder');
  if (!course) notFound();

  return <BuilderLandingContent course={course} />;
}
