import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { marked } from 'marked';
import { supabase, type Post } from '@/lib/supabase';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from('posts').select('title, excerpt').eq('slug', slug).single();
  if (!data) return { title: 'Post Not Found' };
  return { title: `${data.title} | TARAhut AI Labs Blog`, description: data.excerpt };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  'AI Tools': 'bg-blue-50 text-blue-700',
  'Industry News': 'bg-orange-50 text-orange-700',
  'Machine Learning': 'bg-purple-50 text-purple-700',
  'AI Career': 'bg-green-50 text-green-700',
  'Generative AI': 'bg-pink-50 text-pink-700',
  'AI Business': 'bg-amber-50 text-amber-700',
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  const p = post as Post;
  const contentHtml = await marked(p.content, { breaks: true });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e53935] to-[#DC2626] py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-4 ${CATEGORY_COLORS[p.category] ?? 'bg-white/20 text-white'}`}>
            {p.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{p.title}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{formatDate(p.created_at)}</span>
            <span>·</span>
            <span>{p.read_time}</span>
            <span>·</span>
            <span>TARAhut AI Labs</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-[#0F172A]
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-[#475569] prose-p:leading-relaxed
              prose-strong:text-[#0F172A]
              prose-a:text-[#e53935] prose-a:no-underline hover:prose-a:underline
              prose-li:text-[#475569]
              prose-ul:my-4 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#e53935]/10 to-[#DC2626]/10 border border-[#e53935]/20 p-8 text-center">
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Want to master AI skills?</h3>
            <p className="text-[#475569] mb-5">Join TARAhut AI Labs and learn from expert-led, hands-on courses designed for Indian professionals.</p>
            <Link
              href="/courses"
              className="inline-block bg-[#e53935] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#DC2626] transition-colors"
            >
              Explore Courses
            </Link>
          </div>

          {/* Source credit */}
          {p.source_url && (
            <p className="mt-8 text-xs text-[#94A3B8] text-center">
              Inspired by:{' '}
              <a href={p.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {p.source_title ?? p.source_url}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
