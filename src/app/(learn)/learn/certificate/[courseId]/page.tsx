import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { courseConfigs } from '@/config/learn-modules';
import { BuyCourse } from '@/components/learn/buy-all-access';

type Props = { params: Promise<{ courseId: string }> };

export const metadata = {
  title: 'Course Complete! — TARAhut AI Labs',
};

export default async function CertificatePage({ params }: Props) {
  const { courseId } = await params;
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  const course = courseConfigs[courseId];
  if (!course) notFound();

  // Get certificate
  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .limit(1)
    .single();

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#06060e] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not yet completed</h1>
          <p className="text-[#94a3b8] mb-6">Complete all {course.totalSessions} sessions to earn your certificate.</p>
          <Link href="/learn/dashboard" className="text-[#059669] hover:underline">
            Back to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  // Get other courses not yet completed
  const { data: completedCourses } = await supabase
    .from('certificates')
    .select('course_id')
    .eq('student_id', user.id);

  const completedIds = new Set(completedCourses?.map(c => c.course_id) || []);
  const remainingCourses = Object.values(courseConfigs).filter(c => !completedIds.has(c.id));

  return (
    <div className="min-h-screen bg-[#06060e] text-[#e2e8f0]">
      {/* Confetti-like decoration */}
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 left-[10%] h-[300px] w-[300px] rounded-full bg-[#059669]/15 blur-[100px]" />
          <div className="absolute top-20 right-[15%] h-[250px] w-[250px] rounded-full bg-[#fbbf24]/10 blur-[100px]" />
          <div className="absolute bottom-20 left-[30%] h-[200px] w-[200px] rounded-full bg-[#a855f7]/10 blur-[80px]" />
        </div>

        {/* Congratulations Hero */}
        <section className="relative px-6 pt-28 pb-16 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-6 inline-block text-7xl">🎉</span>
            <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-[#fbbf24] via-[#059669] to-[#00f0ff] bg-clip-text text-transparent">
                Congratulations!
              </span>
            </h1>
            <p className="mb-2 text-xl text-white font-semibold">
              You completed {course.title}!
            </p>
            <p className="mb-8 text-lg text-[#94a3b8]">
              All {course.totalSessions} sessions done. You are now certified. We are proud of you!
            </p>
          </div>
        </section>

        {/* Certificate Card */}
        <section className="relative px-6 pb-16">
          <div className="mx-auto max-w-xl">
            <div className="rounded-3xl border-2 border-[#fbbf24]/30 bg-gradient-to-br from-[#0c0c1a] to-[#06060e] p-10 text-center shadow-2xl shadow-[#fbbf24]/5">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#fbbf24]">
                  Certificate of Completion
                </p>
              </div>
              <div className="mb-2 text-sm text-[#94a3b8]">This certifies that</div>
              <h2 className="mb-4 text-3xl font-bold text-white font-serif italic">
                {cert.student_name}
              </h2>
              <div className="mb-4 text-sm text-[#94a3b8]">
                has successfully completed
              </div>
              <h3 className="mb-6 text-xl font-bold text-[#00f0ff]">
                {cert.course_title}
              </h3>
              <div className="flex items-center justify-center gap-8 text-xs text-[#94a3b8]">
                <div>
                  <p className="font-bold text-white">{cert.certificate_number}</p>
                  <p>Certificate ID</p>
                </div>
                <div>
                  <p className="font-bold text-white">
                    {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p>Date Issued</p>
                </div>
              </div>
              <div className="mt-8 border-t border-[#1e1e3a] pt-6">
                <p className="text-xs text-[#94a3b8]">Issued by</p>
                <p className="text-sm font-bold text-[#059669]">TARAhut AI Labs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Motivation + Next Course */}
        <section className="relative px-6 pb-20">
          <div className="mx-auto max-w-4xl">
            {/* Motivational message */}
            <div className="mb-12 rounded-2xl border border-[#059669]/20 bg-[#059669]/5 p-8 text-center">
              <p className="text-lg text-white font-semibold mb-2">
                You are in the top 5% of people who actually finish what they start.
              </p>
              <p className="text-[#94a3b8]">
                Most people watch one video and quit. You completed {course.totalSessions} sessions.
                That dedication is rare — and employers, clients, and opportunities notice it.
              </p>
            </div>

            {/* Return customer offer */}
            {remainingCourses.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#fbbf24]">
                    Special Offer — Just For You
                  </h2>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    Your next course for just <span className="text-[#fbbf24]">₹799</span>
                  </h3>
                  <p className="mb-6 text-[#94a3b8]">
                    As a returning student, you get ₹200 off your next course.
                    Pick one below and keep your learning momentum going.
                  </p>

                  <div className="mb-6 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3">
                      Courses you can take next:
                    </p>
                    {remainingCourses.slice(0, 5).map((c) => (
                      <Link key={c.id} href={`/learn/course/${c.slug}`} className="flex items-center gap-3 rounded-lg border border-[#1e1e3a] bg-[#0c0c1a] p-3 hover:border-[#059669]/40 transition">
                        <span className="text-xl">{c.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{c.title}</p>
                          <p className="text-xs text-[#94a3b8]">{c.totalSessions} sessions</p>
                        </div>
                        <span className="text-xs font-bold text-[#fbbf24]">₹799</span>
                      </Link>
                    ))}
                    {remainingCourses.length > 5 && (
                      <p className="text-xs text-[#94a3b8]">
                        + {remainingCourses.length - 5} more courses
                      </p>
                    )}
                  </div>
                </div>

                {remainingCourses[0] && (
                  <BuyCourse
                    courseId={remainingCourses[0].id}
                    courseTitle={remainingCourses[0].title}
                    totalSessions={remainingCourses[0].totalSessions}
                    price={799}
                    returnCustomer
                  />
                )}
              </div>
            )}

            {/* Share + Dashboard links */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={`https://wa.me/919200882008?text=I+just+completed+${encodeURIComponent(course.title)}+at+TARAhut+AI+Labs!+Certificate:+${cert.certificate_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1eba57] transition"
              >
                Share Achievement on WhatsApp
              </a>
              <Link
                href="/learn/dashboard"
                className="text-sm text-[#94a3b8] underline underline-offset-4 hover:text-white transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
