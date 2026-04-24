import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PeriodicTableLanding } from './periodic-table-landing';

export const metadata: Metadata = {
  title: 'AI Tools Mastery — The Periodic Table of AI | TARAhut AI Labs',
  description: 'Every AI tool that matters in 2026, mapped to the session that teaches it. 16 sessions, 20+ tools, one working lab. No coding.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'ai-tools-mastery-beginners');
  if (!course) notFound();
  return <PeriodicTableLanding course={course} />;
}
