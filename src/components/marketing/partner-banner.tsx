import Link from 'next/link';

export function PartnerBanner() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 lg:grid-cols-2 items-stretch rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0]">

          {/* Left: 2×2 visual grid */}
          <div className="grid grid-cols-2 grid-rows-2 min-h-[360px]">
            <div className="bg-gradient-to-br from-[#e53935] to-[#DC2626] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <svg className="h-10 w-10 mx-auto mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <p className="text-sm font-semibold opacity-90">Growing Network</p>
              </div>
            </div>
            <div className="bg-[#0F172A] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <svg className="h-10 w-10 mx-auto mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <p className="text-sm font-semibold opacity-90">Revenue Sharing</p>
              </div>
            </div>
            <div className="bg-[#DC2626] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <svg className="h-10 w-10 mx-auto mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                <p className="text-sm font-semibold opacity-90">Full Curriculum</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center p-8">
              <div className="text-center text-white">
                <svg className="h-10 w-10 mx-auto mb-3 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
                <p className="text-sm font-semibold opacity-90">Brand & Marketing</p>
              </div>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="bg-[#F8FAF5] flex flex-col justify-center px-10 py-12">
            <span className="inline-block rounded-full bg-[#e53935]/10 px-3 py-1 text-xs font-semibold text-[#e53935] mb-5 w-fit">
              Business Opportunity
            </span>
            <h2 className="text-3xl font-bold text-[#0F172A] leading-tight mb-4">
              Start Your Own AI Learning Center
            </h2>
            <p className="text-[#475569] mb-8">
              Launch your own AI training center with a structured system designed for practical learning and scalable growth.
            </p>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#e53935] to-[#DC2626] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 w-fit"
            >
              Apply for Partnership →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
