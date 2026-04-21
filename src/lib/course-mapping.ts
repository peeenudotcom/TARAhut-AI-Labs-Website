import { courseConfigs } from '@/config/learn-modules';
import { DEFAULT_COURSE_PRICE } from '@/config/pricing';

// The offline /courses/* slugs and the online /learn/course/* slugs
// drifted apart. This is the bridge so offline marketing surfaces can
// link to the matching self-paced online course.
const OFFLINE_TO_ONLINE_SLUG: Record<string, string> = {
  'ai-digital-marketing': 'ai-for-digital-marketing',
  'ai-explorer-school-kids-junior': 'ai-explorer-junior',
  'ai-explorer-school-kids-senior': 'ai-explorer-senior',
  'ai-power-8-week-program': 'ai-power-8-week',
  'generative-ai-prompt-engineering': 'prompt-engineering',
};

export type OnlineCourseLink = {
  slug: string;
  href: string;
  price: number;
};

export function getOnlineCourseLink(offlineSlug: string): OnlineCourseLink | null {
  const onlineSlug = OFFLINE_TO_ONLINE_SLUG[offlineSlug] ?? offlineSlug;
  const config = courseConfigs[onlineSlug];
  if (!config) return null;
  return {
    slug: onlineSlug,
    href: `/learn/course/${onlineSlug}`,
    price: config.onlinePrice ?? DEFAULT_COURSE_PRICE,
  };
}
