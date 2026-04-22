export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  // If set, hovering this item swaps the mega-menu featured card to these values.
  image?: string;
  tagline?: string;
}

export interface NavGroup {
  label: string;
  accent?: 'emerald' | 'teal';
  items: NavItem[];
}

export interface NavFeatured {
  eyebrow: string;
  label: string;
  href: string;
  tagline: string;
  image: string;
  cta: string;
}

export interface NavDropdown {
  label: string;
  items?: NavItem[];
  groups?: NavGroup[];
  featured?: NavFeatured;
  layout?: 'list' | 'grid';
  panelWidth?: number;
  footer?: { label: string; href: string };
}

export type NavEntry = NavItem | NavDropdown;

export function isDropdown(entry: NavEntry): entry is NavDropdown {
  return 'items' in entry || 'groups' in entry;
}

export const navEntries: NavEntry[] = [
  {
    label: 'Courses',
    panelWidth: 820,
    featured: {
      eyebrow: 'Flagship Program',
      label: 'AI Hustler 45',
      href: '/courses/ai-hustler-45',
      tagline: 'Freelance-ready in 45 days — ChatGPT, Claude, Canva AI & automation with real client projects.',
      image: '/images/courses/ai-hustler.jpg',
      cta: 'Explore program',
    },
    groups: [
      {
        label: 'Adult Programs',
        accent: 'emerald',
        items: [
          {
            label: 'AI Tools Mastery',
            href: '/courses/ai-tools-mastery-beginners',
            description: 'ChatGPT, Claude & 10+ tools',
            icon: '🤖',
            image: '/images/courses/ai-tools-mastery.png',
            tagline: 'Get fluent in ChatGPT, Claude and 10+ AI tools for everyday work — no coding required.',
          },
          {
            label: 'AI for Marketing',
            href: '/courses/ai-digital-marketing',
            description: '12-week marketing program',
            icon: '📈',
            image: '/images/courses/ai-digital-marketing.png',
            tagline: '12-week program to run full AI-powered marketing for local businesses and brands.',
          },
          {
            label: 'Master Claude',
            href: '/courses/master-claude-15-days',
            description: '15-day deep dive',
            icon: '🧠',
            image: '/images/courses/prompt-engineering.jpg',
            tagline: '15-day intensive on Anthropic Claude — prompting, projects, artifacts, and agents.',
          },
          {
            label: 'AI Builder 90 Days',
            href: '/courses/master-ai-builder',
            description: 'Full-stack AI development',
            icon: '💻',
            image: '/images/courses/master-ai-builder.jpg',
            tagline: '90-day pathway to ship full-stack AI apps — from prompt to production deployment.',
          },
        ],
      },
      {
        label: 'For School Kids',
        accent: 'teal',
        items: [
          {
            label: 'Kids Junior',
            href: '/courses/ai-explorer-school-kids-junior',
            description: 'Class 5–7 program',
            icon: '🎮',
            image: '/images/courses/ai-explorer-junior.jpg',
            tagline: 'A playful, hands-on intro to AI for Class 5–7 — curiosity, creativity, safety first.',
          },
          {
            label: 'Kids Senior',
            href: '/courses/ai-explorer-school-kids-senior',
            description: 'Class 8–10 program',
            icon: '🎓',
            image: '/images/courses/ai-explorer-senior.jpg',
            tagline: 'AI projects for Class 8–10 students — build real tools, portfolios, and confidence.',
          },
          {
            label: 'All Courses',
            href: '/courses',
            description: 'Browse all 9 programs',
            icon: '📚',
          },
        ],
      },
    ],
    footer: { label: 'Compare all programs →', href: '/courses' },
  },
  { label: 'Start Learning', href: '/learn' },
  {
    label: 'Free Tools',
    layout: 'grid',
    panelWidth: 620,
    items: [
      { label: 'Career Lab', href: '/tools/career-lab', description: 'Discover your AI career path in 60 seconds', icon: '🎯' },
      { label: 'AI Assessment', href: '/assess', description: 'Test your AI readiness', icon: '📊' },
      { label: 'Resources', href: '/resources', description: 'Free PDFs & guides', icon: '📥' },
      { label: 'All Tools', href: '/tools', description: 'Browse every free utility', icon: '⚡' },
    ],
    footer: { label: 'View all tools →', href: '/tools' },
  },
  { label: 'Lab Feed', href: '/lab-feed' },
  { label: 'Blog', href: '/blog' },
  {
    label: 'About',
    panelWidth: 320,
    items: [
      { label: 'Our Story', href: '/about', description: 'Meet the team behind TARAhut', icon: '✨' },
      { label: 'Partner With Us', href: '/partner', description: 'Open your own AI center', icon: '🤝' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export const navCta = { label: 'Free AI Assessment', href: '/assess' } as const;
