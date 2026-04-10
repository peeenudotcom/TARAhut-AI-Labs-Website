import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase, type Post } from '@/lib/supabase';
import { BlogExplorer } from './blog-explorer';

export const metadata: Metadata = {
  title: 'Blog | TARAhut AI Labs',
  description: 'Insights, tutorials, and industry perspectives on AI tools, prompt engineering, and building a career in artificial intelligence.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const allPosts = (posts ?? []) as Post[];
  const featured = allPosts[0] ?? null;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e53935] to-[#DC2626] py-16 text-white border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Daily AI insights, industry news, and practical tips — written for Indian learners and professionals.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {allPosts.length === 0 ? (
            <div className="text-center py-20 text-[#475569]">
              <p className="text-lg">First post coming soon — check back tomorrow!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold">
                        {featured.category}
                      </span>
                      <span className="text-xs text-[#94A3B8]">Latest</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] group-hover:text-[#e53935] transition-colors mb-3">
                      {featured.title}
                    </h2>
                    <p className="text-[#475569] leading-relaxed mb-4 max-w-3xl">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
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
