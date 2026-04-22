// Career Architect — shared recommendation matrix.
// Extracted so the client component (career-architect.tsx) and the
// server-side PDF route can import the same source of truth. Do not
// add client-only imports (framer-motion, etc.) to this file.

import { courses, type Course } from '@/config/courses';

export type Identity = 'student' | 'biz-owner' | 'freelancer' | 'professional';
export type Ambition = 'save-time' | 'make-money' | 'get-job' | 'scale';

export const IDENTITY_OPTIONS: {
  id: Identity;
  label: string;
  icon: string;
  sub: string;
}[] = [
  { id: 'student',      label: 'Student',      icon: '🎓', sub: 'Class 10 → College' },
  { id: 'biz-owner',    label: 'Biz Owner',    icon: '🏪', sub: 'Running a shop or brand' },
  { id: 'freelancer',   label: 'Freelancer',   icon: '💼', sub: 'Client work, solo operator' },
  { id: 'professional', label: 'Professional', icon: '🧑‍💻', sub: 'Salaried, in-house role' },
];

export const AMBITION_OPTIONS: {
  id: Ambition;
  label: string;
  icon: string;
  sub: string;
}[] = [
  { id: 'save-time',  label: 'Save Time',  icon: '⚡', sub: 'Cut hours off daily work' },
  { id: 'make-money', label: 'Make Money', icon: '💰', sub: 'Earn with a new skill' },
  { id: 'get-job',    label: 'Get a Job',  icon: '🚀', sub: 'Land an AI-ready role' },
  { id: 'scale',      label: 'Scale',      icon: '📈', sub: 'Grow output 10×' },
];

export interface Prescription {
  primarySlug: string;
  alternatives: [string, string];
  highlightedIndices: [number, number, number];
  pitch: string;
}

export const RECOMMENDATIONS: Record<`${Identity}-${Ambition}`, Prescription> = {
  // STUDENT
  'student-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['ai-power-8-week-program', 'master-claude-15-days'],
    highlightedIndices: [0, 4, 6],
    pitch: 'Start with the fastest-compounding tool stack — ChatGPT, Claude, and research AI.',
  },
  'student-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-tools-mastery-beginners', 'master-ai-builder'],
    highlightedIndices: [0, 5, 10],
    pitch: 'The 45-day freelance runway — earn your first AI paycheck before graduation.',
  },
  'student-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'ai-hustler-45'],
    highlightedIndices: [0, 6, 11],
    pitch: '8 weeks, capstone project, portfolio — walk into interviews with proof, not promises.',
  },
  'student-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['generative-ai-prompt-engineering', 'ai-power-8-week-program'],
    highlightedIndices: [0, 4, 8],
    pitch: 'Go beyond prompting — build full-stack AI products and ship them to real users.',
  },

  // BIZ OWNER
  'biz-owner-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'ai-digital-marketing'],
    highlightedIndices: [2, 5, 7],
    pitch: 'The operator stack — write, research, and design faster than your competition.',
  },
  'biz-owner-make-money': {
    primarySlug: 'ai-digital-marketing',
    alternatives: ['master-ai-builder', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 4, 8],
    pitch: 'AI marketing is the cheapest growth lever you have. Master it in 12 weeks.',
  },
  'biz-owner-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'ai-hustler-45'],
    highlightedIndices: [0, 5, 10],
    pitch: 'Pivoting? The 8-week comprehensive path builds a portfolio hiring managers trust.',
  },
  'biz-owner-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['ai-digital-marketing', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 9],
    pitch: 'Automate the repetitive, productize the expertise — the 90-day builder path.',
  },

  // FREELANCER
  'freelancer-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 7],
    pitch: 'Bill the same, deliver 3× faster. The 13+ tool stack every freelancer needs.',
  },
  'freelancer-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-digital-marketing', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 8, 11],
    pitch: 'Designed for this. 45 days from zero to earning on Fiverr / Upwork / direct clients.',
  },
  'freelancer-get-job': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-power-8-week-program', 'ai-tools-mastery-beginners'],
    highlightedIndices: [0, 10, 11],
    pitch: 'Freelance is the new job. Build a 45-day runway with real paying clients.',
  },
  'freelancer-scale': {
    primarySlug: 'master-ai-builder',
    alternatives: ['ai-digital-marketing', 'generative-ai-prompt-engineering'],
    highlightedIndices: [1, 5, 10],
    pitch: 'Stop trading hours for money — ship products, build retainers, reclaim your calendar.',
  },

  // PROFESSIONAL
  'professional-save-time': {
    primarySlug: 'ai-tools-mastery-beginners',
    alternatives: ['master-claude-15-days', 'generative-ai-prompt-engineering'],
    highlightedIndices: [2, 5, 6],
    pitch: 'Reclaim 10+ hours a week on the tools you already open daily.',
  },
  'professional-make-money': {
    primarySlug: 'ai-hustler-45',
    alternatives: ['ai-tools-mastery-beginners', 'ai-digital-marketing'],
    highlightedIndices: [2, 8, 10],
    pitch: 'Side income engine — AI skills that pay weekends, no resignation required.',
  },
  'professional-get-job': {
    primarySlug: 'ai-power-8-week-program',
    alternatives: ['ai-tools-mastery-beginners', 'master-claude-15-days'],
    highlightedIndices: [0, 6, 11],
    pitch: '8-week comprehensive program — ship a capstone, build a portfolio, rewrite your resume.',
  },
  'professional-scale': {
    primarySlug: 'generative-ai-prompt-engineering',
    alternatives: ['master-ai-builder', 'master-claude-15-days'],
    highlightedIndices: [0, 5, 10],
    pitch: 'Stop using AI like a beginner. Advanced prompting + custom workflows at expert level.',
  },
};

export interface FlattenedSession {
  n: number;
  title: string;
  tag: string;
}

export function flattenCourse(slug: string): FlattenedSession[] {
  const course = courses.find((c) => c.slug === slug);
  if (!course) return [];
  const sessions: FlattenedSession[] = [];
  course.syllabus.forEach((mod) => {
    const tagMatch = mod.module.match(
      /^(Weeks?|Modules?|Phases?|Days?|Sprints?|Months?)\s+\d+\s*[:—-]\s*(.*)$/i
    );
    const tag = tagMatch ? tagMatch[2].trim() : mod.module;
    mod.topics.forEach((topic) => {
      sessions.push({ n: sessions.length + 1, title: topic, tag });
    });
  });
  return sessions;
}

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getPrescription(identity: Identity, ambition: Ambition): Prescription {
  return RECOMMENDATIONS[`${identity}-${ambition}`];
}

export function getLabel(arr: { id: string; label: string }[], id: string): string {
  return arr.find((o) => o.id === id)?.label ?? id;
}

// Validates incoming API payload values against the matrix's known keys.
// Returns null if either value is invalid.
export function parseIdentityAmbition(
  identity: unknown,
  ambition: unknown
): { identity: Identity; ambition: Ambition } | null {
  const ids = IDENTITY_OPTIONS.map((o) => o.id) as string[];
  const ambs = AMBITION_OPTIONS.map((o) => o.id) as string[];
  if (typeof identity !== 'string' || !ids.includes(identity)) return null;
  if (typeof ambition !== 'string' || !ambs.includes(ambition)) return null;
  return { identity: identity as Identity, ambition: ambition as Ambition };
}
