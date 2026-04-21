import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabase, type Post } from '@/lib/supabase';
import { BlogExplorer } from './blog-explorer';

export const metadata: Metadata = {
  title: 'Blog | TARAhut AI Labs',
  description: 'Insights, tutorials, and industry perspectives on AI tools, prompt engineering, and building a career in artificial intelligence.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const { data: posts } = await getSupabase()
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const allPosts = (posts ?? []) as Post[];
  const featured = allPosts[0] ?? null;

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
            Daily AI Insights
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Daily AI insights, industry news, and practical tips — written for Indian learners and professionals.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#0A0F1C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {allPosts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">First post coming soon — check back tomorrow!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-3 py-1 text-xs font-semibold">
                        {featured.category}
                      </span>
                      <span className="text-xs text-gray-600">Latest</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                      {featured.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-4 max-w-3xl">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        {new Date(featured.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span>{featured.read_time}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Full blog explorer with filters, search, grouping */}
              <BlogExplorer posts={allPosts} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
