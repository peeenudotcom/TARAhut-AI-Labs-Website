import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { courses } from '@/config/courses';
import { notFound } from 'next/navigation';
import { CourseContent } from './course-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  // Get enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', slug)
    .single();

  if (!enrollment) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Not Enrolled
        </h1>
        <p className="text-slate-500 mb-4">
          You&apos;re not enrolled in {course.title}.
        </p>
        <a
          href={`https://wa.me/919200882008?text=Hi%2C+I+want+to+enroll+in+${encodeURIComponent(course.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Contact us to enroll
        </a>
      </div>
    );
  }

  // Get completions
  const { data: completions } = await supabase
    .from('lesson_completions')
    .select('lesson_key')
    .eq('enrollment_id', enrollment.id);

  const completedKeys = new Set((completions ?? []).map((c) => c.lesson_key));

  return (
    <CourseContent
      course={course}
      enrollmentId={enrollment.id}
      completedKeys={Array.from(completedKeys)}
    />
  );
}
