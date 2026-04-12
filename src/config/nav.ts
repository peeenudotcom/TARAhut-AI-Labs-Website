export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
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
      { label: 'All Courses', href: '/courses', description: 'Browse all 9 programs', icon: '📚' },
      { label: 'AI Tools Mastery', href: '/courses/ai-tools-mastery-beginners', description: 'ChatGPT, Claude & 10+ tools', icon: '🤖' },
      { label: 'AI for Marketing', href: '/courses/ai-digital-marketing', description: '12-week marketing program', icon: '📈' },
      { label: 'Master Claude', href: '/courses/master-claude-15-days', description: '15-day deep dive', icon: '🧠' },
      { label: 'AI Builder 90 Days', href: '/courses/master-ai-builder', description: 'Full-stack AI development', icon: '💻' },
      { label: 'AI Hustler 45', href: '/courses/ai-hustler-45', description: 'Freelancing with AI', icon: '🚀' },
      { label: 'Kids Junior', href: '/courses/ai-explorer-school-kids-junior', description: 'Class 5–7 program', icon: '🎮' },
      { label: 'Kids Senior', href: '/courses/ai-explorer-school-kids-senior', description: 'Class 8–10 program', icon: '🎓' },
    ],
  },
  {
    label: 'Free Tools',
    items: [
      { label: 'All Tools', href: '/tools', description: 'Try AI tools for free', icon: '⚡' },
      { label: 'Career Lab', href: '/tools/career-lab', description: 'AI career assessment', icon: '🎯' },
      { label: 'AI Assessment', href: '/assess', description: 'Test your AI readiness', icon: '📊' },
      { label: 'Resources', href: '/resources', description: 'Free PDFs & guides', icon: '📥' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  {
    label: 'About',
    items: [
      { label: 'Our Story', href: '/about', description: 'Meet the team behind TARAhut', icon: '✨' },
      { label: 'Partner With Us', href: '/partner', description: 'Open your own AI center', icon: '🤝' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export const navCta = { label: 'Free AI Assessment', href: '/assess' } as const;
