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
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e53935] to-[#DC2626] py-16 text-white border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Have a question about our courses? Want to partner with us? We would
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Left: Contact Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#0F172A]">
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
                className="flex items-center gap-4 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-6 transition-colors hover:bg-[#25D366]/15"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.48-.742-6.24-2.004l-.436-.326-2.65.889.889-2.65-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    Chat on WhatsApp
                  </p>
                  <p className="text-sm text-[#475569]">
                    Quick replies, usually within minutes
                  </p>
                </div>
              </a>

              {/* Contact Details */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-[#0F172A]">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e53935]/15 text-[#e53935]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        Address
                      </p>
                      <p className="text-sm text-[#475569]">
                        {siteConfig.contact.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e53935]/15 text-[#e53935]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        Phone
                      </p>
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="text-sm text-[#475569] hover:text-[#e53935]"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e53935]/15 text-[#e53935]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        Email
                      </p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-sm text-[#475569] hover:text-[#e53935]"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex h-56 items-center justify-center text-sm text-[#475569]">
                  <div className="text-center">
                    <svg className="mx-auto mb-2 h-8 w-8 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    <p>Kotkapura, Punjab, India</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Map embed coming soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#0F172A]">
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
                      className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#FEF2F2] hover:text-[#e53935]"
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
