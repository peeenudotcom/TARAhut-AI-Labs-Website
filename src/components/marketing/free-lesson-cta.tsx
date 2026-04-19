import Link from 'next/link';

const featuredCourses = [
  { icon: '🚀', title: 'AI Tools Mastery', sessions: 16, slug: 'ai-tools-mastery-beginners', tag: 'Most Popular' },
  { icon: '💰', title: 'AI Hustler 45', sessions: 35, slug: 'ai-hustler-45', tag: 'Flagship' },
  { icon: '📈', title: 'AI for Marketing', sessions: 12, slug: 'ai-for-digital-marketing', tag: 'New' },
];

export function FreeLessonCta() {
  return (
    <section className="relative overflow-hidden bg-[#06060e] py-20 sm:py-28">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[400px] w-[400px] rounded-full bg-[#059669]/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#059669]">
            Try Before You Enroll
          </p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl mb-4">
            Start a{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] to-[#059669] bg-clip-text text-transparent">
              free lesson
            </span>
            {' '}right now
          </h2>
          <p className="mx-auto max-w-xl text-lg text-[#94a3b8]">
            No login. No credit card. Just pick a course, take Session 1, and see why
            students love learning AI with TARAhut.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
          {featuredCourses.map((course) => (
            <Link
              key={course.slug}
              href={`/learn/course/${course.slug}`}
              className="group relative flex flex-col rounded-2xl border border-[#1e1e3a] bg-[#0c0c1a] p-6 transition hover:border-[#059669]/50 hover:shadow-lg hover:shadow-[#059669]/10"
            >
              {course.tag && (
                <span className="absolute top-4 right-4 rounded-full bg-[#059669]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                  {course.tag}
                </span>
              )}
              <span className="mb-3 text-3xl">{course.icon}</span>
              <h3 className="mb-1 text-lg font-bold text-white group-hover:text-[#00f0ff] transition">
                {course.title}
              </h3>
              <p className="mb-4 text-xs text-[#94a3b8]">{course.sessions} interactive sessions</p>
              <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#059669]">
                Try Session 1 Free
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 transition group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#059669]/30 transition hover:bg-[#047857] active:scale-95"
          >
            Browse All 9 Courses
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-[#94a3b8]">
            142 sessions · 3 languages (EN / Hindi / Punjabi) · Certificate included
          </p>
        </div>
      </div>
    </section>
  );
}
