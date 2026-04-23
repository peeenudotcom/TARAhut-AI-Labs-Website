import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ClaudeLandingContent } from '@/components/landing/claude-landing-content';

export const metadata: Metadata = {
  title: 'Master Claude in 15 Days | The Sophisticated Architect | TARAhut AI Labs',
  description:
    'Go beyond basic chat. Master Long-Context, XML Tagging, and the 2026 Artifacts workflow to build full-stack tools with zero code.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'master-claude-15-days');
  if (!course) notFound();

  return <ClaudeLandingContent course={course} />;
}
