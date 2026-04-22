import type { Metadata } from 'next';
import { AnimatedSection } from './animated-section';

export const metadata: Metadata = {
  title: 'About Us | TARAhut AI Labs',
  description:
    'Learn about TARAhut AI Labs — our mission, team, and vision for making AI education accessible across India. Founded in Kotkapura, Punjab.',
};

const values = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: 'Hands-on Learning',
    desc: 'Every course is built around real projects. You learn by doing, not just watching. Build a portfolio while you learn.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: 'Industry-Relevant',
    desc: 'Our curriculum is updated monthly to reflect the latest AI tools and trends. Learn what employers and clients need right now.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community-Driven',
    desc: 'Join a growing network of AI enthusiasts. Get lifetime access to our alumni community, events, and job referrals.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI-Native',
    desc: 'We practice what we teach. Our entire platform, content, and operations are powered by AI — giving you real-world exposure.',
  },
];

// Founder gets her own spotlight section rather than a small avatar
// card — she's the origin story, not a directory entry. Keeps the
// team array for everyone who teaches alongside her.
const founder = {
  name: 'Parveen Sukhija',
  role: 'Founder & Lead Instructor',
  photo: '/images/parveen-sukhija.jpg',
  tagline:
    'Bringing practical AI education to the heart of Punjab, and beyond.',
  bio: [
    `Parveen has spent over 25 years at the intersection of IT, digital marketing, and education — building products, running teams, and teaching. After watching the AI revolution unfold from tier-1 boardrooms, she came back to Kotkapura with one question: why should a student in Punjab wait five years for what a student in Bangalore has today?`,
    `TARAhut AI Labs is the answer. Every curriculum, every session, every tool choice is calibrated against one question: "Will this help a student earn or build within 90 days?" The result is a program that's less theory, more output — and a lab that's always running live projects alongside the teaching.`,
  ],
  quote:
    '"The next decade will reward people who use AI with intent, not people who fear it. Our job is to put that intent within reach."',
  stats: [
    { value: '25+', label: 'Years in tech' },
    { value: '9', label: 'Courses designed' },
    { value: '500+', label: 'Students taught' },
  ],
};

const team: { name: string; role: string; bio: string; specialty?: string; photo?: string; initials?: string }[] = [
  {
    name: 'Liky Prusty',
    role: 'Master Trainer',
    specialty: 'Hands-on AI · Curriculum Lead',
    bio: 'An expert educator with a passion for making AI concepts simple and actionable. Liky leads hands-on training sessions and makes sure every student walks away with a real project, not just a certificate.',
    photo: '/images/liky-prusty.jpeg',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: '#020617' }}
      >
        {/* Glow orbs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: 'rgba(16,185,129,0.12)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ background: 'rgba(16,185,129,0.08)' }}
        />
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Our Story &amp; Mission
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
                About TARAhut AI Labs
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              We are building India&apos;s most practical AI education platform
              — one student, one skill, one breakthrough at a time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-[#0A0F1C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Our Story
              </h2>
              <p className="mb-4 text-gray-400 leading-relaxed">
                TARAhut AI Labs was born in Kotkapura, Punjab, from a simple
                observation: while AI was transforming industries worldwide,
                access to quality, hands-on AI education remained limited in
                tier-2 and tier-3 cities across India.
              </p>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Founded by Parveen Sukhija — a technologist with over 25 years
                of experience in IT, marketing, and education — TARAhut AI Labs
                set out to bridge this gap. We believe that every student,
                professional, and entrepreneur deserves the tools and knowledge
                to thrive in the AI era.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Today, we offer 9 hands-on courses across AI tools, marketing,
                development, and business — all taught in-person at our
                Kotkapura center with real-world projects and direct instructor
                mentorship. Our students come from Kotkapura and neighbouring
                towns in Punjab, united by a shared ambition to master AI and
                build careers of the future.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#020617] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid gap-12 md:grid-cols-2">
              {/* Mission */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15">
                  <svg
                    className="h-6 w-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  Our Mission
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To bring real, practical AI education to every serious learner
                  in India — not just in big cities — so they can build skills
                  that actually work, solve real-world problems, and grow in
                  their careers and businesses.
                </p>
              </div>
              {/* Vision */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15">
                  <svg
                    className="h-6 w-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  Our Vision
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To become India&apos;s most trusted AI learning brand — known
                  for creating job-ready professionals who don&apos;t just
                  understand AI, but use it to build real solutions, create
                  opportunities, and lead in the new digital economy.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0A0F1C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white">
                What We Stand For
              </h2>
              <p className="mt-3 text-gray-400">
                Four principles that guide everything we build and teach.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="flex flex-col items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 text-center backdrop-blur-sm transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06] h-full">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    {v.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight — full portrait, rich story, stats. The
          origin-story moment for the school; everything else on this
          page reports into it. */}
      <section className="relative overflow-hidden bg-[#020617] py-24 sm:py-28">
        {/* Emerald aura + lab grid — matches the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.14) 0%, transparent 60%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
              {/* Portrait — generous dimensions, emerald ring + glow */}
              <div className="relative mx-auto w-full max-w-sm md:max-w-none">
                {/* Ambient emerald wash behind portrait */}
                <div
                  aria-hidden
                  className="absolute -inset-8 rounded-[32px] opacity-60 blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(13,148,136,0.25) 45%, transparent 75%)',
                  }}
                />
                <div className="relative overflow-hidden rounded-[28px] border border-emerald-400/20 bg-white/[0.03] shadow-[0_20px_60px_-20px_rgba(16,185,129,0.5)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    className="block h-auto w-full object-cover"
                  />
                </div>
                {/* Credential chip pinned to the portrait corner */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-[#020617]/90 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.45)] backdrop-blur-sm sm:px-5 sm:py-2 sm:text-[11px]">
                  &gt; Founder &amp; Lead Instructor
                </div>
              </div>

              {/* Copy side */}
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                  &gt; Meet the Founder
                </p>
                <h2 className="mt-3 font-['Space_Grotesk',sans-serif] text-4xl font-bold leading-tight text-white sm:text-5xl">
                  {founder.name}
                </h2>
                <p className="mt-2 text-base font-medium text-emerald-300/90">
                  {founder.tagline}
                </p>

                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-300">
                  {founder.bio.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <blockquote className="mt-7 rounded-xl border-l-2 border-emerald-400 bg-emerald-500/[0.06] p-5 font-['Space_Grotesk',sans-serif] text-base italic leading-snug text-white/95">
                  {founder.quote}
                </blockquote>

                <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-emerald-500/15 pt-6">
                  {founder.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-400/80">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white sm:text-3xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Training Team — everyone who teaches alongside the founder.
          Designed to breathe when there's 1-3 people and scale
          cleanly as the team grows. */}
      <section className="bg-[#0A0F1C] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                &gt; The Lab Team
              </p>
              <h2 className="mt-3 font-['Space_Grotesk',sans-serif] text-3xl font-bold text-white sm:text-4xl">
                Trainers who run the labs with Parveen
              </h2>
              <p className="mt-3 text-gray-400">
                The people you&apos;ll actually meet when you walk into a session.
              </p>
            </div>
          </AnimatedSection>
          <div
            className={`grid gap-6 items-start ${
              team.length === 1
                ? 'mx-auto max-w-md'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="group flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.4)]">
                  {member.photo ? (
                    <div className="relative mb-5">
                      <div
                        aria-hidden
                        className="absolute -inset-2 rounded-full bg-emerald-500/15 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="relative h-32 w-32 rounded-full border-2 border-emerald-400/30 object-cover object-top shadow-md sm:h-36 sm:w-36"
                      />
                    </div>
                  ) : (
                    <div className="mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-3xl font-bold text-white">
                      {member.initials}
                    </div>
                  )}
                  <h3 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    {member.role}
                  </p>
                  {member.specialty && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/75">
                      {member.specialty}
                    </p>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">
                    {member.bio}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
