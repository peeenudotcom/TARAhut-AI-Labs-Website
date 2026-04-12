import Link from 'next/link';
import { learnModules } from '@/config/learn-modules';

export const metadata = {
  title: 'TARAhut Learning Engine',
  description: 'Master AI tools in 4 weeks. 16 interactive sessions, hands-on projects, and a recognised certificate.',
};

const WHATSAPP_ENROLL_URL =
  'https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20enroll%20in%20the%20TARAhut%20AI%20course';

export default function LearnLandingPage() {
  const weekGroups = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[480px] w-[480px] rounded-full bg-[#059669]/10 blur-[120px]" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#059669]">
          TARAhut AI Labs — Learning Engine
        </p>

        <h1 className="relative mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-[#00f0ff] via-[#059669] to-[#a78bfa] bg-clip-text text-transparent">
            Master AI Tools
          </span>
          <br />
          in 4 Weeks
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-[#94a3b8]">
          16 interactive sessions. Hands-on projects. A certificate employers recognise.
          Start free — no credit card required.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/learn/session/1"
            className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#059669]/30 transition hover:bg-[#047857] active:scale-95"
          >
            Experience Session 1 for Free
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="text-sm text-[#94a3b8] underline underline-offset-4 hover:text-[#e2e8f0] transition"
          >
            Already enrolled? Login →
          </Link>
        </div>
      </section>

      {/* ── Session Grid ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#e2e8f0]">
          All 16 Sessions
        </h2>

        {weekGroups.map((week) => {
          const weekModules = learnModules.filter((m) => m.week === week);
          return (
            <div key={week} className="mb-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#059669]">
                Week {week}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {weekModules.map((mod) => (
                  <SessionCard key={mod.session} mod={mod} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Enroll CTA ── */}
      <section className="border-t border-[#1e1e3a] bg-[#0c0c1a] px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold text-[#e2e8f0]">
          Ready to unlock all 16 modules?
        </h2>
        <p className="mb-8 text-[#94a3b8]">
          Join the next cohort. Limited seats available.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={WHATSAPP_ENROLL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:bg-[#1ebe5d] active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enroll via WhatsApp
          </a>
          <Link
            href="/login"
            className="text-sm text-[#94a3b8] underline underline-offset-4 hover:text-[#e2e8f0] transition"
          >
            Already enrolled? Login →
          </Link>
        </div>
      </section>
    </div>
  );
}

function SessionCard({ mod }: { mod: (typeof learnModules)[number] }) {
  const sessionStr = String(mod.session).padStart(2, '0');

  if (mod.isFree) {
    return (
      <Link
        href="/learn/session/1"
        className="group relative flex flex-col rounded-xl border-2 border-[#059669] bg-[#0c0c1a] p-5 transition hover:border-[#10b981] hover:shadow-lg hover:shadow-[#059669]/20"
      >
        <span className="mb-1 inline-flex w-fit rounded-full bg-[#059669]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#059669]">
          Free Preview
        </span>
        <p className="mb-0.5 text-xs font-medium text-[#94a3b8]">Session {mod.session}</p>
        <h3 className="mb-2 text-sm font-bold text-[#e2e8f0] group-hover:text-[#00f0ff] transition">
          {mod.title}
        </h3>
        <p className="text-xs leading-relaxed text-[#94a3b8]">{mod.description}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#059669]">
          Start now
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-5 opacity-70">
      {/* blur overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#06060e]/60 backdrop-blur-[2px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-7 w-7 text-[#94a3b8]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span className="text-xs text-[#94a3b8]">Enroll to unlock</span>
      </div>

      <p className="mb-0.5 text-xs font-medium text-[#94a3b8]">Session {mod.session}</p>
      <h3 className="mb-2 text-sm font-bold text-[#e2e8f0]">{mod.title}</h3>
      <p className="text-xs leading-relaxed text-[#94a3b8]">{mod.description}</p>
    </div>
  );
}
