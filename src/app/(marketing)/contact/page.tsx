import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact Us | TARAhut AI Labs',
  description:
    'Get in touch with TARAhut AI Labs. Reach us via WhatsApp, email, or phone for course enquiries, partnerships, and support.',
};

export default function ContactPage() {
  return (
    <>
      {/* Dark Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: '#020617' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[15%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ background: 'rgba(16,185,129,0.10)' }} />
          <div className="absolute bottom-[-20%] right-[10%] w-[300px] h-[300px] rounded-full blur-[120px]" style={{ background: 'rgba(13,148,136,0.08)' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-white/5 border border-emerald-400/20 backdrop-blur-md text-sm text-emerald-300">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            We&apos;d Love to Hear From You
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Have a question about our courses? Want to partner with us? We would
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-20 bg-[#0A0F1C] overflow-hidden">
        {/* Emerald aura — keeps the section in the same visual universe as
            the hero so it doesn't read as a flat "broken link" panel. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[-20%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[140px]"
            style={{ background: 'rgba(16,185,129,0.08)' }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[420px] h-[420px] rounded-full blur-[120px]"
            style={{ background: 'rgba(13,148,136,0.06)' }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Left: Contact Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Right: Contact Info */}
            <div className="space-y-8">
              {/* WhatsApp CTA */}
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 p-6 transition-colors hover:bg-[#25D366]/15"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Chat on WhatsApp
                  </p>
                  <p className="text-sm text-gray-400">
                    Quick replies, usually within minutes
                  </p>
                </div>
              </a>

              {/* Contact Details */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6">
                <h3 className="mb-5 text-lg font-semibold text-white">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Address
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Railway Road, Mehta Chowk<br />
                        Kotkapura, Punjab 151204<br />
                        India
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${siteConfig.contact.googleMapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Phone
                      </p>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="text-sm text-gray-400 hover:text-emerald-400"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Email
                      </p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-sm text-gray-400 hover:text-emerald-400"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="overflow-hidden rounded-xl border border-white/[0.08]">
                <iframe
                  src={`https://maps.google.com/maps?q=${siteConfig.contact.googleMapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TARAhut AI Labs location"
                />
                <div className="p-4 bg-white/[0.03] border-t border-white/[0.06]">
                  <p className="text-sm font-semibold text-white">
                    TARAhut AI Labs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Railway Road, Mehta Chowk, Kotkapura, Punjab 151204
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${siteConfig.contact.googleMapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Get directions →
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { label: 'Instagram', href: siteConfig.links.instagram },
                    { label: 'LinkedIn', href: siteConfig.links.linkedin },
                    { label: 'YouTube', href: siteConfig.links.youtube },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
