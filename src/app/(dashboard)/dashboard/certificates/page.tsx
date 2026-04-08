import { requireAuth } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase-server';
import { siteConfig } from '@/config/site';

export default async function CertificatesPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabase();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('student_id', user.id)
    .order('issued_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Certificates
      </h1>
      <p className="text-slate-500 mb-8">
        Your earned certificates from Uplrn AI Labs.
      </p>

      {(!certificates || certificates.length === 0) ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">
            No certificates yet. Complete a course to earn your first certificate.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => {
            const verifyUrl = `${siteConfig.url}/verify/${cert.verification_id}`;
            const linkedinShareUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course_title)}&organizationName=${encodeURIComponent('Uplrn AI Labs')}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(cert.verification_id)}`;

            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {cert.course_title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Issued {new Date(cert.issued_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      ID: {cert.verification_id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`/verify/${cert.verification_id}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 transition-colors"
                  >
                    View Certificate
                  </a>
                  <a
                    href={linkedinShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
                  >
                    Add to LinkedIn
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
