'use client'

import Link from 'next/link'
import { Award, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-32 pb-24"
      style={{ backgroundColor: '#080f14', color: '#e2e9f0' }}
    >
      {/* Dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(153,247,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
        style={{ background: 'rgba(153,247,255,0.10)', filter: 'blur(120px)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'rgba(0,106,106,0.10)', filter: 'blur(100px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* LEFT — copy */}
          <div className="lg:col-span-7 space-y-8 font-[family-name:var(--font-manrope)]">
            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                color: '#99f7ff',
                border: '1px solid rgba(153,247,255,0.2)',
                background: 'rgba(29,39,46,0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ background: '#99f7ff' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: '#99f7ff' }}
                />
              </span>
              Punjab&apos;s First Offline AI Training Center
            </div>

            {/* Heading */}
            <h1
              className="font-[family-name:var(--font-space-grotesk)] text-5xl lg:text-7xl font-bold leading-[1.1]"
              style={{
                backgroundImage: 'linear-gradient(135deg, #99f7ff 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              Learn AI Skills <br />That Actually Pay
            </h1>

            {/* Subhead */}
            <p
              className="text-lg lg:text-xl max-w-2xl leading-relaxed"
              style={{ color: '#a5acb3' }}
            >
              Master{' '}
              <span className="font-semibold" style={{ color: '#99f7ff' }}>
                ChatGPT, Claude, Canva AI &amp; Automation
              </span>{' '}
              at Punjab&apos;s first dedicated offline AI training center — hands-on projects,
              real outcomes, no fluff.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://wa.me/919200882008?text=Hi%2C+I+want+to+book+a+free+demo+class+at+TARAhut+AI+Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundImage: 'linear-gradient(to right, #99f7ff, #00f1fe)',
                  color: '#005f64',
                  boxShadow: '0 0 30px rgba(0,241,254,0.4)',
                }}
              >
                Book Free Demo
              </a>
              <Link
                href="/courses"
                className="px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                style={{
                  border: '1px solid #42494f',
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  color: '#e2e9f0',
                }}
              >
                Explore Courses
              </Link>
            </div>

            {/* Tools */}
            <div className="pt-12 space-y-4">
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: '#6f767d' }}
              >
                Tools you&apos;ll master
              </p>
              <div className="flex flex-wrap gap-3">
                {['ChatGPT', 'Claude', 'Canva AI', 'Midjourney', 'Python'].map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: 'rgba(29,39,46,0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: '#e2e9f0',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — founder */}
          <div className="lg:col-span-5 relative">
            <div className="relative group">
              {/* Outer glow */}
              <div
                className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(153,247,255,0.2), rgba(140,243,243,0.2))',
                }}
              />

              {/* Glass frame (3D perspective tilt) */}
              <div
                className="relative rounded-2xl overflow-hidden p-2"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transform: 'perspective(1200px) rotateY(-6deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/parveen-sukhija.jpg"
                  alt="Parveen Sukhija — Founder, TARAhut AI Labs"
                  className="w-full h-auto rounded-lg object-cover filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  style={{ objectPosition: 'center 18%', aspectRatio: '4 / 5' }}
                />
              </div>

              {/* Top-right: 25+ Years */}
              <div
                className="absolute -top-6 -right-6 p-4 rounded-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px -10px rgba(153,247,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(153,247,255,0.2)', color: '#99f7ff' }}
                  >
                    <Award className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-white leading-none">
                      25+ Years
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: '#a5acb3' }}
                    >
                      Experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom-left: Punjab, India */}
              <div
                className="absolute -bottom-8 -left-8 p-4 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                style={{
                  background: 'rgba(29,39,46,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px -10px rgba(6,182,212,0.15)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(140,243,243,0.2)', color: '#8cf3f3' }}
                  >
                    <MapPin className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-white leading-none">
                      Punjab, India
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: '#a5acb3' }}
                    >
                      HQ Center
                    </p>
                  </div>
                </div>
              </div>

              {/* Name badge on photo (bottom-right) */}
              <div
                className="absolute bottom-6 right-6 px-4 py-2 rounded-lg"
                style={{
                  background: 'rgba(29,39,46,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p
                  className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold"
                  style={{ color: '#99f7ff' }}
                >
                  Parveen Sukhija
                </p>
                <p className="text-[10px] uppercase text-slate-300">
                  Founder, TARAhut AI Labs
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
