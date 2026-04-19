import Link from 'next/link';
import { notFound } from 'next/navigation';
import { courseConfigs } from '@/config/learn-modules';
import { BuyCourse } from '@/components/learn/buy-all-access';
import type { Metadata } from 'next';

const WHATSAPP_ENROLL_URL =
  'https://wa.me/919200882008?text=Hi%2C%20I%20want%20to%20enroll%20in%20the%20TARAhut%20AI%20course';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.values(courseConfigs).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = Object.values(courseConfigs).find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.title} — TARAhut AI Labs`,
    description: course.description || `Master ${course.title} with TARAhut AI Labs. ${course.totalSessions} interactive sessions.`,
  };
}

export default async function CourseLandingPage({ params }: Props) {
  const { slug } = await params;
  const course = Object.values(courseConfigs).find((c) => c.slug === slug);
  if (!course) notFound();

  const freeSession = course.modules.find((m) => m.isFree);
  const courseParam = course.id !== 'ai-tools-mastery-beginners' ? `?course=${course.id}` : '';
  const weekNums = [...new Set(course.modules.map((m) => m.week))].sort((a, b) => a - b);
  const totalWeeks = weekNums.length;

  // Collect all unique tools
  const allTools = [...new Set(course.modules.flatMap((m) => m.tools).filter(Boolean))];

  // Collect sample quiz questions from free session
  const sampleQuestions = freeSession?.previewQuestions?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-[#059669]/10 blur-[140px]" />
        </div>
        <div aria-hidden className="pointer-events-none absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-[#a855f7]/8 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl">
          {course.icon && (
            <span className="mb-4 inline-block text-5xl">{course.icon}</span>
          )}
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#059669]">
            TARAhut AI Labs — {course.duration || `${course.totalSessions} Sessions`}
          </p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#059669] to-[#a78bfa] bg-clip-text text-transparent">
              {course.title}
            </span>
          </h1>
          {course.tagline && (
            <p className="mb-6 text-xl text-[#00f0ff] font-semibold">{course.tagline}</p>
          )}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            {course.description}
          </p>

          {/* Price badge */}
          {course.originalPrice && (
            <div className="mb-6 inline-flex items-baseline gap-3 rounded-2xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-6 py-3">
              <span className="text-3xl font-extrabold text-white">₹{course.onlinePrice || 999}</span>
              <span className="text-lg text-[#94a3b8] line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
              <span className="rounded-full bg-[#fbbf24]/20 px-2.5 py-0.5 text-xs font-bold text-[#fbbf24]">
                {Math.round(((course.originalPrice - (course.onlinePrice || 999)) / course.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="#buy"
              className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#059669]/30 transition hover:bg-[#047857] hover:scale-[1.02] active:scale-95"
            >
              Buy Course — ₹{course.onlinePrice || 999}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            {freeSession && (
              <Link
                href={`/learn/session/${freeSession.session}${courseParam}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#059669]/40 px-8 py-4 text-base font-semibold text-[#059669] transition hover:bg-[#059669]/10 active:scale-95"
              >
                Try Session 1 Free First
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-[#1e1e3a] bg-[#0c0c1a] px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-center sm:gap-16">
          <div>
            <p className="text-3xl font-extrabold text-[#00f0ff]">{course.totalSessions}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Sessions</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#a855f7]">{totalWeeks}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Weeks</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#059669]">{allTools.length}+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8]">AI Tools</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#fbbf24]">3</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8]">Languages</p>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      {course.highlights && course.highlights.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-[#059669]">
            What You&apos;ll Master
          </h2>
          <p className="mb-12 text-center text-3xl font-bold text-[#e2e8f0]">
            Skills that make you <span className="text-[#00f0ff]">unstoppable</span>
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {course.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-6 transition hover:border-[#059669]/40 hover:shadow-lg hover:shadow-[#059669]/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#059669]/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[#059669]">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-base text-[#e2e8f0]">{h}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WHO IS THIS FOR ── */}
      {course.audience && (
        <section className="border-y border-[#1e1e3a] bg-[#0c0c1a] px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#a855f7]">
              Who Is This For
            </h2>
            <p className="text-2xl font-bold text-[#e2e8f0] leading-relaxed">
              {course.audience}
            </p>
          </div>
        </section>
      )}

      {/* ── CURRICULUM ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-[#059669]">
          Full Curriculum
        </h2>
        <p className="mb-12 text-center text-3xl font-bold text-[#e2e8f0]">
          {course.totalSessions} sessions, {totalWeeks} weeks of <span className="text-[#00f0ff]">hands-on learning</span>
        </p>

        <div className="space-y-10">
          {weekNums.map((week) => {
            const weekModules = course.modules.filter((m) => m.week === week);
            return (
              <div key={week}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#059669]/20 text-xs font-bold text-[#059669]">
                    W{week}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#94a3b8]">
                    Week {week}
                  </span>
                </div>
                <div className="space-y-3">
                  {weekModules.map((mod) => (
                    <div
                      key={mod.session}
                      className={`flex items-start gap-4 rounded-xl border p-5 transition ${
                        mod.isFree
                          ? 'border-[#059669]/40 bg-[#059669]/5 hover:border-[#059669]'
                          : 'border-[#1e1e3a] bg-[#0c0c1a]/60'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        mod.isFree
                          ? 'bg-[#059669] text-white'
                          : 'bg-[#1e1e3a] text-[#94a3b8]'
                      }`}>
                        {mod.session}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#e2e8f0]">{mod.title}</h3>
                          {mod.isFree && (
                            <span className="rounded-full bg-[#059669]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                              Free Preview
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#94a3b8]">{mod.description}</p>
                        {mod.tools.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {mod.tools.map((tool) => (
                              <span key={tool} className="rounded-md bg-[#1e1e3a] px-2 py-0.5 text-[10px] font-medium text-[#94a3b8]">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 text-[10px] text-[#059669]">
                          Deliverable: {mod.deliverable}
                        </p>
                      </div>
                      {mod.isFree && (
                        <Link
                          href={`/learn/session/${mod.session}${courseParam}`}
                          className="shrink-0 rounded-lg bg-[#059669] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#047857]"
                        >
                          Start Free →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TOOLS YOU'LL LEARN ── */}
      {allTools.length > 0 && (
        <section className="border-y border-[#1e1e3a] bg-[#0c0c1a] px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-[#fbbf24]">
              Tools You&apos;ll Master
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {allTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-xl border border-[#1e1e3a] bg-[#06060e] px-4 py-2 text-sm font-medium text-[#e2e8f0] transition hover:border-[#059669]/40"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SAMPLE QUIZ ── */}
      {sampleQuestions.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-[#00f0ff]">
            Can You Answer These?
          </h2>
          <p className="mb-10 text-center text-2xl font-bold text-[#e2e8f0]">
            Preview questions from Session 1
          </p>

          <div className="space-y-6">
            {sampleQuestions.map((q, qi) => (
              <div key={qi} className="rounded-xl border border-[#1e1e3a] bg-[#0c0c1a] p-6">
                <p className="mb-4 text-sm font-bold text-[#e2e8f0]">
                  <span className="mr-2 text-[#00f0ff]">Q{qi + 1}.</span>
                  {q.q}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className="rounded-lg border border-[#1e1e3a] bg-[#06060e] px-4 py-2.5 text-xs text-[#94a3b8]"
                    >
                      <span className="mr-2 font-bold text-[#94a3b8]">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] italic text-[#059669]">
                  Start the free session to find out the answer!
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            {freeSession && (
              <Link
                href={`/learn/session/${freeSession.session}${courseParam}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#059669]/30 transition hover:bg-[#047857] active:scale-95"
              >
                Take Session 1 Free — Find the Answers
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── ENROLL CTA ── */}
      <section id="buy" className="scroll-mt-16 border-t border-[#1e1e3a] bg-gradient-to-b from-[#0c0c1a] to-[#06060e] px-6 py-24">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-4 text-3xl font-extrabold text-[#e2e8f0] sm:text-4xl">
              Ready to master <span className="text-[#00f0ff]">{course.title}</span>?
            </h2>
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">₹{course.onlinePrice || 999}</span>
              {course.originalPrice && (
                <>
                  <span className="text-lg text-[#94a3b8] line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="rounded-full bg-[#fbbf24]/20 px-2 py-0.5 text-xs font-bold text-[#fbbf24]">
                    {Math.round(((course.originalPrice - (course.onlinePrice || 999)) / course.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="mb-6 text-[#94a3b8]">
              {course.totalSessions} sessions · Certificate included · Lifetime access
            </p>
            {freeSession && (
              <Link
                href={`/learn/session/${freeSession.session}${courseParam}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#059669]/40 px-6 py-3 text-sm font-semibold text-[#059669] transition hover:bg-[#059669]/10 mb-6"
              >
                Try Session 1 Free First →
              </Link>
            )}
            <p className="text-xs text-[#94a3b8]/60">
              Offline students at TARAhut centers get free access through their trainer.
            </p>
          </div>
          <BuyCourse courseId={course.id} courseTitle={course.title} totalSessions={course.totalSessions} originalPrice={course.originalPrice} />
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/learn"
            className="text-sm text-[#94a3b8] underline underline-offset-4 hover:text-[#e2e8f0] transition"
          >
            ← Browse all courses
          </Link>
        </div>
      </section>
    </div>
  );
}
