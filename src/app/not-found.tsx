import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl md:text-9xl font-extrabold text-slate-200 mb-4 select-none">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Need help? <Link href="/contact" className="text-emerald-600 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  )
}
