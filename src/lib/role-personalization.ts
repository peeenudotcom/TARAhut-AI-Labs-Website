import type { UserRole } from '@/lib/hooks/use-user-role'

// Single source of truth for which courses, taglines, and testimonials
// each role cares about. Imported by hero, course-highlights,
// why-tarahut, testimonials-section so they all personalise from the
// same map (no drift). Order inside each array = priority order.

export const ROLE_COURSE_SLUGS: Record<UserRole, string[]> = {
  'biz-owner':    ['ai-digital-marketing', 'master-ai-builder', 'ai-power-8-week-program'],
  'student':      ['generative-ai-prompt-engineering', 'master-ai-builder', 'ai-power-8-week-program'],
  'freelancer':   ['ai-tools-mastery-beginners', 'generative-ai-prompt-engineering', 'ai-hustler-45'],
  'professional': ['ai-tools-mastery-beginners', 'master-claude-15-days', 'generative-ai-prompt-engineering'],
}

export const ROLE_TAGLINES: Record<UserRole, string> = {
  'biz-owner':    'Built for founders who want AI to run their business — not the other way around. Real workflows, real ROI, no fluff.',
  'student':      'Built for students who want to graduate already AI-fluent — and a step ahead of every cohort applying for the same jobs.',
  'freelancer':   'Built for freelancers who want to ship faster, charge premium rates, and own a stack clients keep coming back for.',
  'professional': 'Built for working pros who want AI to make them irreplaceable at work — without quitting to study full-time.',
}

export const ROLE_HEADLINE_ACCENT: Record<UserRole, string> = {
  'biz-owner':    'Punjab Founders',
  'student':      'Career-Ready Students',
  'freelancer':   'Premium Freelancers',
  'professional': 'In-House AI Champions',
}

// Score lower = higher priority. Items not in the role's list go to the back.
export function rolePrioritySorter<T>(
  role: UserRole | null,
  getSlug: (item: T) => string,
): (a: T, b: T) => number {
  if (!role) return () => 0
  const priority = ROLE_COURSE_SLUGS[role] ?? []
  const score = (slug: string) => {
    const idx = priority.indexOf(slug)
    return idx === -1 ? 999 : idx
  }
  return (a, b) => score(getSlug(a)) - score(getSlug(b))
}
