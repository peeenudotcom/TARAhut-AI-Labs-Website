import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { courses } from '@/config/courses';
import { schoolCourses } from '@/config/school-courses';
import { Badge } from '@/components/ui/badge';
import { CourseSyllabus } from './course-syllabus';
import { SchoolCourseSyllabus } from './school-course-syllabus';
import { EnrollmentCard } from './enrollment-card';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-600',
  Intermediate: 'bg-amber-500/15 text-amber-600',
  Advanced: 'bg-rose-500/15 text-rose-600',
};

export async function generateStaticParams() {
  return [
    ...courses.map((course) => ({ slug: course.slug })),
    ...schoolCourses.map((course) => ({ slug: course.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.title} | TARAhut AI Labs`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const schoolCourse = schoolCourses.find((c) => c.slug === slug);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#059669] to-[#0D9488] py-16 text-white border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
          >
            &larr; All Courses
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${levelColors[course.level]}`}
            >
              {course.level}
            </span>
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            {schoolCourse && (
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                {schoolCourse.subtitle}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            {course.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </span>
            {schoolCourse ? (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Batch starting soon
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {course.rating} rating
              </span>
            )}
            {schoolCourse ? (
              <span>{schoolCourse.modules} modules · {schoolCourse.enrolled} enrolled</span>
            ) : (
              <span>{course.studentsEnrolled}+ students enrolled</span>
            )}
            <span>by {course.instructorName}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Left Column */}
            <div>

              {/* About This Course */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">About This Course</h2>
                <p className="text-[#475569] leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">What You&apos;ll Achieve</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-[#D1FAE5] bg-[#F0FDF4] p-3">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-[#475569]">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights — school courses only */}
              {schoolCourse && (
                <div className="mb-12">
                  <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">Course Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {schoolCourse.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#059669] text-white text-[10px] font-bold">{i + 1}</span>
                        <span className="text-sm text-[#475569]">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus */}
              <div className="mb-12">
                <h2 className="mb-2 text-2xl font-bold text-[#0F172A]">Course Syllabus</h2>
                {schoolCourse ? (
                  <>
                    <p className="mb-4 text-sm text-[#64748B]">{schoolCourse.modules} modules · 12 sessions × 2 hours · 24 hours total</p>
                    <SchoolCourseSyllabus syllabus={schoolCourse.syllabus} />
                  </>
                ) : (
                  <CourseSyllabus syllabus={course.syllabus} />
                )}
              </div>

              {/* Tools */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">Tools You Will Master</h2>
                <div className="flex flex-wrap gap-2">
                  {(schoolCourse?.tools ?? course.tools).map((tool) => (
                    <span key={tool} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-sm font-medium text-[#0F172A]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Who is this for — school courses only */}
              {schoolCourse && (
                <div className="mb-12">
                  <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">Who Is This For?</h2>
                  <ul className="space-y-3">
                    {schoolCourse.whoIsThisFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[#475569]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What you get — school courses only */}
              {schoolCourse && (
                <div className="mb-12 rounded-2xl bg-gradient-to-br from-[#059669]/5 to-[#0D9488]/5 border border-[#059669]/10 p-6">
                  <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">What You Get</h2>
                  <ul className="space-y-3">
                    {schoolCourse.whatYouGet.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#475569] font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column — Sticky Enrollment Card with Payment */}
            <EnrollmentCard
              courseSlug={course.slug}
              courseTitle={course.title}
              price={course.price}
              originalPrice={course.originalPrice}
              duration={course.duration}
              level={course.level}
              category={course.category}
              instructorName={course.instructorName}
              enrolledCount={schoolCourse ? String(schoolCourse.enrolled) : `${course.studentsEnrolled}+`}
              modulesCount={schoolCourse ? schoolCourse.modules : course.syllabus.length}
              isSchoolCourse={Boolean(schoolCourse)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
