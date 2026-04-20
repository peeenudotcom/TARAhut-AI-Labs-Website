'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, ChevronDown, ArrowRight } from 'lucide-react';

import { siteConfig } from '@/config/site';
import {
  navEntries,
  navCta,
  isDropdown,
  type NavDropdown,
  type NavItem,
  type NavGroup,
} from '@/config/nav';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

const accentText: Record<NonNullable<NavGroup['accent']>, string> = {
  emerald: 'border-emerald-400/70 text-emerald-300',
  teal: 'border-teal-300/70 text-teal-200',
};

function DropdownItem({
  item,
  pathname,
  onClick,
  hoverAccent = 'emerald',
  onPreview,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
  hoverAccent?: 'emerald' | 'teal';
  onPreview?: (item: NavItem) => void;
}) {
  const isActive = pathname === item.href;
  const hoverText = hoverAccent === 'teal' ? 'group-hover:text-teal-200' : 'group-hover:text-emerald-300';
  const iconHoverBg = hoverAccent === 'teal' ? 'group-hover:bg-teal-400/10' : 'group-hover:bg-emerald-400/10';

  const handlePreview = () => onPreview?.(item);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={handlePreview}
      onFocus={handlePreview}
      className={cn(
        'group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
        'hover:bg-white/[0.04]',
        isActive && 'bg-white/[0.05]'
      )}
    >
      {item.icon && (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-base transition-colors',
            iconHoverBg
          )}
        >
          {item.icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-semibold text-white transition-colors',
            hoverText,
            isActive && (hoverAccent === 'teal' ? 'text-teal-200' : 'text-emerald-300')
          )}
        >
          {item.label}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs leading-snug text-gray-400">{item.description}</p>
        )}
      </div>
    </Link>
  );
}

type FeaturedCard = {
  eyebrow: string;
  label: string;
  href: string;
  tagline: string;
  image: string;
  cta: string;
};

function MegaPanel({
  entry,
  pathname,
  onClose,
  width,
}: {
  entry: NavDropdown;
  pathname: string;
  onClose: () => void;
  width: number;
}) {
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  // Map previewable items → { item, group } so we can derive the eyebrow from group.label
  const previewable = new Map<string, { item: NavItem; group: NavGroup }>();
  entry.groups?.forEach((group) => {
    group.items.forEach((item) => {
      if (item.image && item.tagline) {
        previewable.set(item.href, { item, group });
      }
    });
  });

  const preview = previewHref ? previewable.get(previewHref) : null;
  const defaultCta = entry.featured?.cta ?? 'Explore program';

  const featured: FeaturedCard | null = preview
    ? {
        eyebrow: preview.group.label,
        label: preview.item.label,
        href: preview.item.href,
        tagline: preview.item.tagline ?? preview.item.description ?? '',
        image: preview.item.image!,
        cta: defaultCta,
      }
    : entry.featured ?? null;

  const handlePreview = (item: NavItem) => {
    // Only update preview if the item has its own image/tagline; otherwise keep the
    // previous (usually flagship) so we don't clear the card on hover of "All Courses".
    if (item.image && item.tagline) setPreviewHref(item.href);
  };

  return (
    <div
      style={{ width }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0F1F]/95 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/12 blur-[90px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-teal-500/10 blur-[80px]" />

      <div className="relative grid grid-cols-12 gap-6">
        {featured && (
          <div className="col-span-5 min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featured.href}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Link
                  href={featured.href}
                  onClick={onClose}
                  className="group flex flex-col overflow-hidden rounded-xl border border-emerald-400/15 bg-white/[0.02] transition-all hover:border-emerald-400/40"
                >
                  <div className="relative aspect-[5/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.image}
                      alt={featured.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1F] via-[#0A0F1F]/40 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {featured.eyebrow}
                    </span>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300">
                      {featured.label}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
                      {featured.tagline}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 transition-transform group-hover:translate-x-0.5">
                      {featured.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className={cn('grid gap-6', featured ? 'col-span-7 grid-cols-2' : 'col-span-12 grid-cols-2')}>
          {entry.groups!.map((group) => (
            <div key={group.label}>
              <h5
                className={cn(
                  'mb-3 border-l-2 pl-2.5 text-[11px] font-bold uppercase tracking-[0.14em]',
                  accentText[group.accent ?? 'emerald']
                )}
              >
                {group.label}
              </h5>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <DropdownItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClick={onClose}
                    hoverAccent={group.accent}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {entry.footer && (
        <div className="relative mt-5 flex items-center justify-end border-t border-white/[0.06] pt-4">
          <Link
            href={entry.footer.href}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
          >
            {entry.footer.label}
          </Link>
        </div>
      )}
    </div>
  );
}

function DesktopPanel({ entry, pathname, onClose }: { entry: NavDropdown; pathname: string; onClose: () => void }) {
  const width = entry.panelWidth ?? (entry.groups ? 780 : entry.layout === 'grid' ? 620 : 320);

  // Grid layout (Free Tools): 2×2 of card-like items
  if (entry.layout === 'grid' && entry.items) {
    return (
      <div style={{ width }} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0F1F]/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-[80px]"
        />
        <div className="relative grid grid-cols-2 gap-3">
          {entry.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-lg ring-1 ring-inset ring-emerald-400/20 transition-transform group-hover:scale-[1.05]">
                  {item.icon}
                </span>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-300">
                  {item.label}
                </p>
              </div>
              {item.description && (
                <p className="mt-3 text-xs leading-snug text-gray-400">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
        {entry.footer && (
          <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
            <span className="font-medium tracking-widest uppercase text-gray-500">TARAhut AI Labs · v1.0</span>
            <Link
              href={entry.footer.href}
              onClick={onClose}
              className="inline-flex items-center gap-1 font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {entry.footer.label}
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Mega layout (Courses): featured card + grouped columns
  if (entry.groups) {
    return <MegaPanel entry={entry} pathname={pathname} onClose={onClose} width={width} />;
  }

  // Simple list (About)
  return (
    <div style={{ width }} className="rounded-2xl border border-white/[0.06] bg-[#0A0F1F]/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
      {entry.items?.map((item) => (
        <DropdownItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
      ))}
    </div>
  );
}

function DesktopDropdown({ entry, pathname }: { entry: NavDropdown; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const allItems: NavItem[] = [
    ...(entry.items ?? []),
    ...(entry.groups?.flatMap((g) => g.items) ?? []),
    ...(entry.featured ? [{ label: entry.featured.label, href: entry.featured.href }] : []),
  ];
  const isActive = allItems.some((item) => pathname === item.href);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  const close = () => setOpen(false);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={cn(
          'flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors',
          'font-[family-name:var(--font-space-grotesk)]',
          isActive || open
            ? 'text-emerald-300'
            : 'text-gray-300 hover:text-emerald-200'
        )}
      >
        {entry.label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
          <DesktopPanel entry={entry} pathname={pathname} onClose={close} />
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ entry, pathname }: { entry: NavDropdown; pathname: string }) {
  const [open, setOpen] = useState(false);

  const flatItems: NavItem[] = [
    ...(entry.featured ? [{ label: `${entry.featured.label} (Featured)`, href: entry.featured.href, icon: '⭐' }] : []),
    ...(entry.items ?? []),
    ...(entry.groups?.flatMap((g) => g.items) ?? []),
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-white/[0.06]',
          flatItems.some((item) => pathname === item.href)
            ? 'text-emerald-300'
            : 'text-white'
        )}
      >
        {entry.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-emerald-500/30 pl-3">
          {flatItems.map((item) => (
            <SheetClose key={item.href} render={<Link href={item.href} />}>
              <span
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.06]',
                  pathname === item.href
                    ? 'text-emerald-300'
                    : 'text-gray-400'
                )}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                {item.label}
              </span>
            </SheetClose>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-[#020617]/70 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-2xl'
          : 'border-b border-transparent bg-[#020617]/25 backdrop-blur-2xl'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-tarahut-white.png"
            alt={siteConfig.name}
            className="h-7 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navEntries.map((entry) =>
            isDropdown(entry) ? (
              <DesktopDropdown key={entry.label} entry={entry} pathname={pathname} />
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors',
                  'font-[family-name:var(--font-space-grotesk)]',
                  pathname === entry.href
                    ? 'text-emerald-300'
                    : 'text-gray-300 hover:text-emerald-200'
                )}
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center lg:flex">
          <a
            href="https://wa.me/919200882008?text=Hi%2C+I+want+to+book+a+free+demo+class+at+TARAhut+AI+Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_20px_-6px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_10px_30px_-6px_rgba(16,185,129,0.6)] active:scale-[0.97]"
          >
            Book Free Demo
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="size-5 text-white" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="border-white/[0.08] bg-[#020617]">
              <SheetHeader>
                <SheetTitle>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    {siteConfig.name}
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navEntries.map((entry) =>
                  isDropdown(entry) ? (
                    <MobileDropdown key={entry.label} entry={entry} pathname={pathname} />
                  ) : (
                    <SheetClose key={entry.href} render={<Link href={entry.href} />}>
                      <span
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-white/[0.06]',
                          pathname === entry.href
                            ? 'text-emerald-300'
                            : 'text-white'
                        )}
                      >
                        {entry.label}
                      </span>
                    </SheetClose>
                  )
                )}
                <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4">
                  <Button
                    className="w-full border border-emerald-500 bg-transparent text-emerald-300 hover:bg-white/[0.06]"
                    render={<Link href={navCta.href} />}
                  >
                    {navCta.label}
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    render={<Link href="/contact" />}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
