import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { courses } from '@/config/courses';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  // Fetch enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', user.id)
    .is('completed_at', null);

  // Fetch certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('student_id', user.id);

  // Fetch completion counts per enrollment
  const enrollmentIds = enrollments?.map((e) => e.id) ?? [];
  const { data: completions } = enrollmentIds.length > 0
    ? await supabase
        .from('lesson_completions')
        .select('enrollment_id')
        .in('enrollment_id', enrollmentIds)
    : { data: [] };

  // Map enrollments to courses with progress
  const enrolledCourses = (enrollments ?? []).map((enrollment) => {
    const course = courses.find((c) => c.slug === enrollment.course_id);
    const totalLessons = course?.syllabus.reduce(
      (sum, mod) => sum + mod.topics.length,
      0
    ) ?? 0;
    const completedLessons = (completions ?? []).filter(
      (c) => c.enrollment_id === enrollment.id
    ).length;
    const progress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return {
      enrollment,
      course,
      progress,
      completedLessons,
      totalLessons,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Welcome back
      </h1>
      <p className="text-slate-500 mb-8">
        Continue your AI learning journey.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Enrolled Courses</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {enrolledCourses.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Certificates Earned</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {certificates?.length ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 md:col-span-1">
          <p className="text-sm text-slate-500">Overall Progress</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {enrolledCourses.length > 0
              ? Math.round(
                  enrolledCourses.reduce((sum, c) => sum + c.progress, 0) /
                    enrolledCourses.length
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Your Courses
      </h2>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">
            You&apos;re not enrolled in any courses yet.
          </p>
          <a
            href="https://wa.me/919200882008?text=Hi%2C+I+want+to+enroll+in+a+course+at+TARAhut+AI+Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Contact us to enroll
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {enrolledCourses.map(({ enrollment, course, progress, completedLessons, totalLessons }) => (
            <Link
              key={enrollment.id}
              href={`/dashboard/course/${course?.slug ?? ''}`}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {course?.title ?? 'Unknown Course'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {course?.duration} &middot; {course?.level}
                  </p>
                </div>
                <span className="text-sm font-medium text-emerald-600">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
