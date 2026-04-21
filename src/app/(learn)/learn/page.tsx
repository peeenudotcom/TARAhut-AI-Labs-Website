import Link from 'next/link';
import { courseConfigs } from '@/config/learn-modules';
import { BuyCourse } from '@/components/learn/buy-all-access';

export const metadata = {
  title: 'TARAhut Learning Engine',
  description: 'Master AI tools with TARAhut. Interactive sessions, hands-on projects, and a recognised certificate.',
};

const WHATSAPP_ENROLL_URL =
  'https://wa.me/919200882008?text=Hi%2C%20I%20want%20to%20enroll%20in%20the%20TARAhut%20AI%20course';

export default function LearnLandingPage() {
  const courses = Object.values(courseConfigs);

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
            Master AI
          </span>
          <br />
          with TARAhut
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-[#94a3b8]">
          Choose your course. Hands-on sessions, real projects, and a certificate employers recognise.
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

      {/* ── Course Cards ── */}
      <section id="courses" className="mx-auto max-w-6xl px-6 pb-12 scroll-mt-24">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-[#94a3b8]">
          9 Courses · 142 Sessions · 3 Languages
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const freeSession = course.modules.find((m) => m.isFree);
            const courseParam = course.id !== 'ai-tools-mastery-beginners' ? `?course=${course.id}` : '';
            return (
              <div
                key={course.id}
                className="group relative flex flex-col rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-6 transition hover:border-[#059669]/50 hover:shadow-lg hover:shadow-[#059669]/10"
              >
                {course.icon && (
                  <span className="mb-3 text-3xl">{course.icon}</span>
                )}
                <h3 className="mb-1 text-lg font-bold text-[#e2e8f0] group-hover:text-[#00f0ff] transition">
                  {course.title}
                </h3>
                {course.tagline && (
                  <p className="mb-3 text-xs font-semibold text-[#059669]">{course.tagline}</p>
                )}
                <p className="mb-4 flex-1 text-xs leading-relaxed text-[#94a3b8]">
                  {course.description || `${course.totalSessions} interactive sessions with hands-on projects.`}
                </p>
                <div className="mb-5 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  <span>{course.totalSessions} sessions</span>
                  <span className="h-1 w-1 rounded-full bg-[#94a3b8]" />
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/learn/course/${course.slug}`}
                    className="rounded-lg bg-[#059669] px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-[#059669]/20 transition hover:bg-[#047857] active:scale-[0.98]"
                  >
                    Buy Course — ₹999
                  </Link>
                  {freeSession && (
                    <Link
                      href={`/learn/session/${freeSession.session}${courseParam}`}
                      className="rounded-lg border border-[#1e1e3a] bg-[#06060e] px-4 py-2.5 text-center text-xs font-semibold text-[#94a3b8] transition hover:border-[#059669]/40 hover:text-[#00f0ff]"
                    >
                      Try Session 1 Free →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-[#1e1e3a] bg-[#0c0c1a] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#059669]">
            How It Works
          </p>
          <h2 className="mb-4 text-3xl font-bold text-[#e2e8f0]">
            Any course for just <span className="text-[#00f0ff]">₹999</span>
          </h2>
          <p className="mb-10 text-[#94a3b8]">
            Pick a course, pay ₹999, and start learning. Complete sessions one by one — finish one to unlock the next. Earn a certificate when you complete the course.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-[#1e1e3a] bg-[#06060e] p-6">
              <span className="text-2xl mb-3 block">📱</span>
              <h3 className="text-sm font-bold text-white mb-1">1. Buy a Course</h3>
              <p className="text-xs text-[#94a3b8]">Pay ₹999 via Razorpay. Instant access to Session 1.</p>
            </div>
            <div className="rounded-xl border border-[#1e1e3a] bg-[#06060e] p-6">
              <span className="text-2xl mb-3 block">📖</span>
              <h3 className="text-sm font-bold text-white mb-1">2. Learn Step by Step</h3>
              <p className="text-xs text-[#94a3b8]">Complete a session → next one auto-unlocks. No rushing.</p>
            </div>
            <div className="rounded-xl border border-[#1e1e3a] bg-[#06060e] p-6">
              <span className="text-2xl mb-3 block">🎓</span>
              <h3 className="text-sm font-bold text-white mb-1">3. Get Certified</h3>
              <p className="text-xs text-[#94a3b8]">Finish all sessions → certificate auto-generated. Take another course for ₹799!</p>
            </div>
          </div>
          <p className="mt-8 text-xs text-[#94a3b8]/60">
            Offline students enrolled at TARAhut centers get free access through their trainer.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            href="#courses"
            className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#059669]/30 transition hover:bg-[#047857] active:scale-95"
          >
            Pick a Course & Pay ₹999
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
    </div>
  );
}

