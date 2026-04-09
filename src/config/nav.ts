export interface NavItem {
  label: string;
  href: string;
}

export interface NavDropdown {
  label: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavDropdown;

export function isDropdown(entry: NavEntry): entry is NavDropdown {
  return 'items' in entry;
}

export const navEntries: NavEntry[] = [
  {
    label: 'Courses',
    items: [
      { label: 'All Courses', href: '/courses' },
      { label: 'AI Tools Mastery', href: '/courses/ai-tools-mastery-beginners' },
      { label: 'AI for Marketing', href: '/courses/ai-digital-marketing' },
      { label: 'AI for Business', href: '/courses/ai-business-leaders' },
      { label: 'AI Content Creation', href: '/courses/ai-video-content-creation' },
      { label: 'Master Claude in 15 Days', href: '/courses/master-claude-15-days' },
    ],
  },
  {
    label: 'Free Tools',
    items: [
      { label: 'All Tools', href: '/tools' },
      { label: 'Career Lab', href: '/tools/career-lab' },
      { label: 'AI Assessment', href: '/assess' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  {
    label: 'About',
    items: [
      { label: 'Our Story', href: '/about' },
      { label: 'Partner With Us', href: '/partner' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

// Highlighted CTA in nav (separate from regular items)
export const navCta = { label: 'Free AI Assessment', href: '/assess' } as const;
