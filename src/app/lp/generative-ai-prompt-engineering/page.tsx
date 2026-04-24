import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PromptAlchemistLanding } from './prompt-alchemist-landing';

export const metadata: Metadata = {
  title: 'Prompt Engineering — Master the Language of Machines | TARAhut AI Labs',
  description: 'Architect instructions that unlock maximum reasoning from ChatGPT, Claude, Gemini, and beyond. The #1 AI skill of 2026.',
};

export default function Page() {
  const course = courses.find((c) => c.slug === 'generative-ai-prompt-engineering');
  if (!course) notFound();
  return <PromptAlchemistLanding course={course} />;
}
