import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { courses } from '@/config/courses';
import { schoolCourses } from '@/config/school-courses';
import { siteConfig } from '@/config/site';
import { getCoursePricing } from '@/config/pricing';
import { getOnlineCourseLink } from '@/lib/course-mapping';
import { Badge } from '@/components/ui/badge';
import { CourseSyllabus } from './course-syllabus';
import { SchoolCourseSyllabus } from './school-course-syllabus';
import { EnrollmentCard } from './enrollment-card';
import { EnrollmentToast } from '@/components/landing/enrollment-toast';
import { CourseSchema } from '@/components/seo/structured-data';
import { VisualTimeline } from '@/components/courses/visual-timeline';
import { HeroSpline } from '@/components/courses/hero-spline';
import { FreeSessionHook } from '@/components/landing/free-session-hook';

// Spline scene used as the hero 3D background. Single shared scene
// across all courses for now — can be parametrized per-course later if
// the designer produces bespoke scenes.
const HERO_SPLINE_URL =
  'https://prod.spline.design/Z96Y7Jp-3zUe3N8o/scene.splinecode';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-400',
  Intermediate: 'bg-amber-500/15 text-amber-400',
  Advanced: 'bg-rose-500/15 text-rose-400',
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
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [{ url: `${siteConfig.url}${course.thumbnail}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.shortDescription,
      images: [`${siteConfig.url}${course.thumbnail}`],
    },
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

  // Online equivalent (null when no matching self-paced course exists).
  // Drives the primary "Try Session 1 Free" hero CTA.
  const onlineLink = getOnlineCourseLink(course.slug);

  // Tools shown in the hero ticker — prefer school course tools list when
  // available so kid-specific branding takes precedence. The ticker duplicates
  // the array to create a seamless infinite loop.
  const tickerTools = schoolCourse?.tools ?? course.tools;

  return (
    <>
      <CourseSchema course={course} />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-white border-b border-white/[0.08] sm:py-24" style={{ backgroundColor: '#020617' }}>
        {/* Static thumbnail fallback — shown on mobile, reduced-motion, or
            while the Spline scene is loading. Keeps the hero looking
            intentional even when the 3D scene is skipped. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />

        {/* 3D Spline scene — desktop only, after LCP, respects reduced-motion. */}
        <HeroSpline url={HERO_SPLINE_URL} />

        {/* Readability gradient on top of the Spline scene. Darkens the
            bottom portion where the CTAs + meta row sit so text contrast
            stays AA-compliant regardless of what the 3D scene renders. */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#020617]/40 via-[#020617]/60 to-[#020617]" />

        {/* Emerald radial glow — the "AI Lab" signal the designer mocked up */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(5, 150, 105, 0.18) 0%, transparent 55%)',
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            ) : course.rating > 0 ? (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {course.rating} rating
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                New · First batch open
              </span>
            )}
            {schoolCourse ? (
              <span>{schoolCourse.modules} modules · Limited seats</span>
            ) : null}
            <span>by {course.instructorName}</span>
          </div>

          {/* Hero CTAs — primary is the free-session hook (highest intent, no
              price friction); secondary scrolls to the offline enrollment
              card for students who want the live batch. */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {onlineLink && (
              <FreeSessionHook
                courseSlug={onlineLink.slug}
                label="Try Session 1 Free"
              />
            )}
            <a
              href="#syllabus"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Explore the Syllabus →
            </a>
          </div>

          {/* Tool ticker — infinite horizontal marquee of tools this course
              covers. Duplicated once so the CSS translate loop reads as
              seamless. */}
          {tickerTools.length > 0 && (
            <div className="el-tool-ticker mt-10">
              <div className="el-tool-ticker-track" aria-hidden={false}>
                {tickerTools.map((tool) => (
                  <span key={`a-${tool}`} className="el-tool-ticker-pill">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="el-tool-ticker-track" aria-hidden>
                {tickerTools.map((tool) => (
                  <span key={`b-${tool}`} className="el-tool-ticker-pill">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Left Column */}
            <div>

              {/* About This Course */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-white">About This Course</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-white">What You&apos;ll Achieve</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, i) => (
                    <div key={i} className="el-glass-card-subtle flex items-start gap-3 p-3" style={{ borderColor: 'rgba(5,150,105,0.3)', background: 'rgba(5,150,105,0.08)' }}>
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-300">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-white">What&apos;s Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: '📖', title: 'Student Workbook', desc: 'Fill-in workbook with exercises for every session' },
                    { icon: '⚡', title: 'Prompt Library', desc: '50+ ready-to-use prompts across 8 categories' },
                    { icon: '🎯', title: 'Real Projects', desc: 'Build 4 portfolio-worthy projects during the course' },
                    { icon: '🛠️', title: 'Tool Setup Guide', desc: 'Step-by-step account setup for all 13+ tools' },
                    { icon: '📋', title: 'Assignments & Briefs', desc: 'Homework + detailed project briefs with rubrics' },
                    { icon: '🏆', title: 'Certificate', desc: 'TARAhut-verified certificate, shareable on LinkedIn' },
                  ].map((item) => (
                    <div key={item.title} className="el-glass-card-subtle flex items-start gap-3 p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-lg">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights — school courses only */}
              {schoolCourse && (
                <div className="mb-12">
                  <h2 className="mb-4 text-2xl font-bold text-white">Course Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {schoolCourse.highlights.map((h, i) => (
                      <div key={i} className="el-glass-card-subtle flex items-start gap-3 p-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#059669] text-white text-[10px] font-bold">{i + 1}</span>
                        <span className="text-sm text-gray-400">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus — scrollytelling visual timeline. School courses keep
                  the condensed accordion because their syllabus shape is
                  different (modules numbered 1..N with sessions per module)
                  and VisualTimeline expects the regular syllabus shape. */}
              <div id="syllabus" className="mb-12 scroll-mt-24">
                <h2 className="mb-2 text-2xl font-bold text-white">Course Syllabus</h2>
                {schoolCourse ? (
                  <>
                    <p className="mb-4 text-sm text-gray-500">{schoolCourse.modules} modules · 12 sessions × 2 hours · 24 hours total</p>
                    <SchoolCourseSyllabus syllabus={schoolCourse.syllabus} />
                  </>
                ) : (
                  <>
                    <p className="mb-6 text-sm text-gray-500">{course.syllabus.length} phases · {course.duration} · scroll to explore</p>
                    <VisualTimeline phases={course.syllabus} />
                  </>
                )}
              </div>

              {/* Tools */}
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-white">Tools You Will Master</h2>
                <div className="flex flex-wrap gap-2">
                  {(schoolCourse?.tools ?? course.tools).map((tool) => (
                    <span key={tool} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Who is this for — school courses only */}
              {schoolCourse && (
                <div className="mb-12">
                  <h2 className="mb-4 text-2xl font-bold text-white">Who Is This For?</h2>
                  <ul className="space-y-3">
                    {schoolCourse.whoIsThisFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What you get — school courses only */}
              {schoolCourse && (
                <div className="mb-12 rounded-2xl bg-gradient-to-br from-[#059669]/5 to-[#0D9488]/5 border border-[#059669]/10 p-6">
                  <h2 className="mb-4 text-2xl font-bold text-white">What You Get</h2>
                  <ul className="space-y-3">
                    {schoolCourse.whatYouGet.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-400 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column — Sticky Enrollment Card with Payment.
                Pricing comes from src/config/pricing.ts (single source of
                truth) so the displayed amount matches what the server
                charges — `course.price` on the marketing config is only
                used as a strike-through original. */}
            <EnrollmentCard
              courseSlug={course.slug}
              courseTitle={course.title}
              price={getCoursePricing(course.slug).price}
              originalPrice={getCoursePricing(course.slug).originalPrice ?? course.originalPrice}
              duration={course.duration}
              level={course.level}
              category={course.category}
              instructorName={course.instructorName}
              enrolledCount={schoolCourse ? String(schoolCourse.enrolled) : course.studentsEnrolled > 0 ? `${course.studentsEnrolled}+` : 'New'}
              modulesCount={schoolCourse ? schoolCourse.modules : course.syllabus.length}
              isSchoolCourse={Boolean(schoolCourse)}
            />
          </div>
        </div>
      </section>
      <EnrollmentToast />
    </>
  );
}
