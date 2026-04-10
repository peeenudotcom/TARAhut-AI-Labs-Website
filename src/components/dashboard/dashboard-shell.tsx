'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'grid' },
  { label: 'Certificates', href: '/dashboard/certificates', icon: 'award' },
]

function NavIcon({ icon }: { icon: string }) {
  if (icon === 'grid') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 10.5h-1.5A3.375 3.375 0 007.5 14.25v4.5m9-9V6a3 3 0 00-3-3H10.5a3 3 0 00-3 3v3.75" />
    </svg>
  )
}

export function DashboardShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold text-slate-900">
              TARAhut AI Labs
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-red-50 text-red-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-slate-500">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Log out
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-600'
                }`}
              >
                <NavIcon icon={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  )
}
