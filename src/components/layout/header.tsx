'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { navEntries, navCta, isDropdown, type NavDropdown } from '@/config/nav';
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

function DesktopDropdown({ entry, pathname }: { entry: NavDropdown; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isActive = entry.items.some((item) => pathname === item.href);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[#059669]',
          isActive ? 'text-[#059669]' : 'text-[#475569]'
        )}
      >
        {entry.label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className="min-w-[200px] rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
            {entry.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700',
                  pathname === item.href
                    ? 'text-[#059669] bg-emerald-50/50'
                    : 'text-[#475569]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ entry, pathname }: { entry: NavDropdown; pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-[#F0FDF4]',
          entry.items.some((item) => pathname === item.href)
            ? 'text-[#059669]'
            : 'text-[#0F172A]'
        )}
      >
        {entry.label}
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-emerald-100 pl-3">
          {entry.items.map((item) => (
            <SheetClose key={item.href} render={<Link href={item.href} />}>
              <span
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F0FDF4]',
                  pathname === item.href
                    ? 'text-[#059669]'
                    : 'text-[#475569]'
                )}
              >
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[#E2E8F0] bg-white/95 shadow-sm backdrop-blur-lg'
          : 'border-b border-[#E2E8F0] bg-white/95 backdrop-blur-lg'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-tarahut.png"
            alt={siteConfig.name}
            className="h-7 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navEntries.map((entry) =>
            isDropdown(entry) ? (
              <DesktopDropdown key={entry.label} entry={entry} pathname={pathname} />
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[#059669]',
                  pathname === entry.href
                    ? 'text-[#059669]'
                    : 'text-[#475569]'
                )}
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={navCta.href}
            className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-500 px-4 text-sm font-medium text-emerald-600 transition-all hover:bg-emerald-50"
          >
            {navCta.label}
          </Link>
          <a
            href="https://wa.me/919200882008?text=Hi%2C+I+want+to+book+a+free+demo+class+at+TARAhut+AI+Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-emerald-500/25"
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
                  <Menu className="size-5 text-[#0F172A]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="bg-white border-[#E2E8F0]">
              <SheetHeader>
                <SheetTitle>
                  <span className="bg-gradient-to-r from-[#059669] to-[#0D9488] bg-clip-text text-transparent">
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
                          'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-[#F0FDF4]',
                          pathname === entry.href
                            ? 'text-[#059669]'
                            : 'text-[#0F172A]'
                        )}
                      >
                        {entry.label}
                      </span>
                    </SheetClose>
                  )
                )}
                <div className="mt-4 border-t border-[#E2E8F0] pt-4 space-y-2">
                  <Button
                    className="w-full border border-emerald-500 text-emerald-600 bg-transparent hover:bg-emerald-50"
                    render={<Link href={navCta.href} />}
                  >
                    {navCta.label}
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-[#059669] to-[#0D9488] text-white"
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
