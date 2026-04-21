import { MetadataRoute } from 'next'
import { getSupabase } from '@/lib/supabase'
import { siteConfig } from '@/config/site'
import { courses } from '@/config/courses'
import { schoolCourses } from '@/config/school-courses'

const staticRoutes = [
  '',
  '/courses',
  '/about',
  '/blog',
  '/contact',
  '/faq',
  '/partner',
  '/privacy',
  '/refund',
  '/terms',
  '/tools',
  '/resources',
  '/assess',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Posts are public (published=true filter), so the anon key is enough —
  // no need for the service-role client here. Also means Preview builds
  // (which don't get SUPABASE_SERVICE_ROLE_KEY) can generate a sitemap.
  let posts: { slug: string; created_at: string }[] = []
  try {
    const { data } = await getSupabase()
      .from('posts')
      .select('slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
    posts = data ?? []
  } catch {
    // Supabase unreachable (missing env in preview, network issue) — the
    // sitemap still lists every known static + course route, which is what
    // SEO needs for a preview deploy. Posts reappear on the next prod deploy.
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // All course pages (main courses + school courses, de-duped by slug)
  const allCourseSlugs = [
    ...courses.map((c) => c.slug),
    ...schoolCourses
      .map((c) => c.slug)
      .filter((slug) => !courses.some((c) => c.slug === slug)),
  ]

  const courseRoutes: MetadataRoute.Sitemap = allCourseSlugs.map((slug) => ({
    url: `${siteConfig.url}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const staticSitemap: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticSitemap, ...courseRoutes, ...blogRoutes]
}
