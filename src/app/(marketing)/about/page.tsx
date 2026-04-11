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

const team: { name: string; role: string; bio: string; photo?: string; initials?: string }[] = [
  {
    name: 'Parveen Sukhija',
    role: 'Founder & Lead Instructor',
    bio: 'With 25+ years of experience across IT, digital marketing, and education, Parveen founded TARAhut AI Labs to bring practical AI education to Punjab and beyond.',
    photo: '/images/parveen-sukhija.jpg',
  },
  {
    name: 'Liky Prusty',
    role: 'Master Trainer',
    bio: 'An expert educator with a passion for making AI concepts simple and actionable. Liky leads hands-on training sessions and ensures every student builds real-world skills.',
    photo: '/images/liky-prusty.jpeg',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#059669] to-[#0D9488] py-20 text-white border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About TARAhut AI Labs
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              We are building India&apos;s most practical AI education platform
              — one student, one skill, one breakthrough at a time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-[#0F172A]">
                Our Story
              </h2>
              <p className="mb-4 text-[#475569] leading-relaxed">
                TARAhut AI Labs was born in Kotkapura, Punjab, from a simple
                observation: while AI was transforming industries worldwide,
                access to quality, hands-on AI education remained limited in
                tier-2 and tier-3 cities across India.
              </p>
              <p className="mb-4 text-[#475569] leading-relaxed">
                Founded by Parveen Sukhija — a technologist with over 25 years
                of experience in IT, marketing, and education — TARAhut AI Labs
                set out to bridge this gap. We believe that every student,
                professional, and entrepreneur deserves the tools and knowledge
                to thrive in the AI era.
              </p>
              <p className="text-[#475569] leading-relaxed">
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
      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid gap-12 md:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#059669]/15">
                  <svg
                    className="h-6 w-6 text-[#059669]"
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
                <h3 className="mb-3 text-xl font-bold text-[#0F172A]">
                  Our Mission
                </h3>
                <p className="text-[#475569] leading-relaxed">
                  To bring real, practical AI education to every serious learner
                  in India — not just in big cities — so they can build skills
                  that actually work, solve real-world problems, and grow in
                  their careers and businesses.
                </p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0D9488]/15">
                  <svg
                    className="h-6 w-6 text-[#0D9488]"
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
                <h3 className="mb-3 text-xl font-bold text-[#0F172A]">
                  Our Vision
                </h3>
                <p className="text-[#475569] leading-relaxed">
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
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                What We Stand For
              </h2>
              <p className="mt-3 text-[#475569]">
                Four principles that guide everything we build and teach.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="flex flex-col items-center rounded-xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md hover:shadow-[#059669]/5 h-full">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669]">
                    {v.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">
                    {v.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#0F172A]">
                Meet the Team
              </h2>
              <p className="mt-3 text-[#475569]">
                The people behind TARAhut AI Labs.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="flex flex-col items-center rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
                  {'photo' in member ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="mb-4 h-24 w-24 rounded-full object-cover object-top shadow-md bg-[#F0FDF4]"
                    />
                  ) : (
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#059669] to-[#0D9488] text-2xl font-bold text-white">
                      {member.initials}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#0F172A]">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-[#059669]">
                    {member.role}
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
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
