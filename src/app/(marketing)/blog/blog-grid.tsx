'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {posts.map((post, i) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="group flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:shadow-md hover:shadow-[#e53935]/5 hover:-translate-y-0.5"
        >
          <div className="mb-3 flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
            <span className="text-xs text-[#64748B]">
              {post.readTime}
            </span>
          </div>

          <h2 className="mb-2 text-lg font-semibold text-[#0F172A] group-hover:text-[#e53935] transition-colors leading-snug">
            {post.title}
          </h2>

          <p className="mb-4 flex-1 text-sm text-[#475569] leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
            <span className="text-xs text-[#64748B]">{post.date}</span>
            <span className="text-sm font-medium text-[#e53935] group-hover:underline">
              Read More &rarr;
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
