import { createServiceClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { id } = await params;
  const db = createServiceClient();

  const { data: cert } = await db
    .from('certificates')
    .select('*')
    .eq('verification_id', id)
    .single();

  if (!cert) notFound();

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Verification badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Verified Certificate
          </div>
        </div>

        {/* Certificate card */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-lg overflow-hidden print:shadow-none print:border">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-center text-white">
            <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
            <p className="text-emerald-100 text-sm mt-1">Certificate of Completion</p>
          </div>

          {/* Body */}
          <div className="px-8 py-10 text-center">
            <p className="text-slate-500 text-sm mb-2">This certifies that</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {cert.student_name}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              has successfully completed the course
            </p>
            <h3 className="text-xl font-semibold text-emerald-700 mb-6">
              {cert.course_title}
            </h3>

            <div className="flex justify-center gap-8 text-sm text-slate-500">
              <div>
                <p className="font-medium text-slate-700">Date Issued</p>
                <p>{issuedDate}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Certificate ID</p>
                <p className="font-mono">{cert.verification_id}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Verify this certificate at {siteConfig.url}/verify/{cert.verification_id}
            </p>
          </div>
        </div>

        {/* Print button */}
        <div className="text-center mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
