import Link from 'next/link';

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#06060e] text-[#e2e8f0]">
      {/* ── Learn Header ── */}
      <header className="sticky top-0 z-50 border-b border-[#1e1e3a] bg-[#06060e]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo → Home */}
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
            <span className="text-lg font-bold text-[#059669]">TARAhut</span>
            <span className="text-xs text-[#94a3b8]">AI Labs</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/learn"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white sm:text-sm"
            >
              All Courses
            </Link>
            <Link
              href="/courses"
              className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white sm:block sm:text-sm"
            >
              Programs
            </Link>
            <Link
              href="/blog"
              className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white md:block md:text-sm"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition hover:bg-[#1e1e3a] hover:text-white md:block md:text-sm"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-[#059669]/40 px-3 py-1.5 text-xs font-semibold text-[#059669] transition hover:bg-[#059669]/10 sm:text-sm"
            >
              Login
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-[#059669] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#047857] sm:text-sm"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {children}

      {/* ── Learn Footer ── */}
      <footer className="border-t border-[#1e1e3a] bg-[#0c0c1a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/courses" className="hover:text-white transition">Programs</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
          <p className="text-xs text-[#94a3b8]/60">
            © 2026 TARAhut AI Labs · Kotkapura, Punjab
          </p>
        </div>
      </footer>
    </div>
  );
}
