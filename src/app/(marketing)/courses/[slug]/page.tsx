import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { courses } from '@/config/courses';
import { schoolCourses } from '@/config/school-courses';
import { Badge } from '@/components/ui/badge';
import { CourseSyllabus } from './course-syllabus';
import { SchoolCourseSyllabus } from './school-course-syllabus';
import { siteConfig } from '@/config/site';

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
    title: `${course.title} | Uplrn AI Labs`,
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

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

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

            {/* Right Column — Sticky Enrollment Card */}
            <div className="lg:self-start lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
                {/* Price header */}
                <div className="bg-gradient-to-r from-[#059669] to-[#0D9488] p-6 text-white">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      ₹{course.price.toLocaleString('en-IN')}
                    </span>
                    {course.originalPrice && (
                      <span className="text-lg text-white/60 line-through">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <p className="mt-1 text-sm text-white/80">
                      {discount}% off — Limited time offer
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="p-6">
                  <a
                    href={`${siteConfig.links.whatsapp}?text=Hi, I'm interested in the ${course.title} course.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1eba57]"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    Enroll via WhatsApp
                  </a>

                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=Enquiry: ${course.title}`}
                    className="flex w-full items-center justify-center rounded-lg border border-[#E2E8F0] px-6 py-3 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                  >
                    Email Enquiry
                  </a>

                  {/* Course Meta */}
                  <div className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Duration</span>
                      <span className="font-medium text-[#0F172A]">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Level</span>
                      <span className="font-medium text-[#0F172A]">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Category</span>
                      <span className="font-medium text-[#0F172A]">{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Instructor</span>
                      <span className="font-medium text-[#0F172A]">{course.instructorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Enrolled</span>
                      <span className="font-medium text-[#0F172A]">
                        {schoolCourse ? schoolCourse.enrolled : `${course.studentsEnrolled}+`} students
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Modules</span>
                      <span className="font-medium text-[#0F172A]">
                        {schoolCourse ? schoolCourse.modules : course.syllabus.length} modules
                      </span>
                    </div>
                    {schoolCourse && (
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Batch size</span>
                        <span className="font-medium text-[#059669]">Max 10 students</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
