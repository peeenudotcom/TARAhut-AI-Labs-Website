export const navItems = [
  { label: 'Courses', href: '/courses' },
  { label: 'Free Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

// Highlighted CTA in nav (separate from regular items)
export const navCta = { label: 'Free AI Assessment', href: '/assess' } as const;
