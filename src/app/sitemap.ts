import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';
import { hasJapanesePost } from '@/lib/contentSeo';
import { absoluteUrl, languageAlternates, localizedPath, staticPages } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, translated = true) => {
    for (const locale of translated ? ['en', 'ja'] as const : ['en'] as const) {
      entries.push({ url: absoluteUrl(localizedPath(path, locale)), alternates: { languages: languageAlternates(path, translated) } });
    }
  };
  Object.keys(staticPages).forEach(path => add(path));
  posts.forEach(post => add(`/blog/post/${post.slug.join('/')}`, hasJapanesePost(post.slug)));
  projects.forEach(project => add(`/projects/${project.slug}`));
  // Omit lastModified until content has an explicit editorial update date.
  // File mtimes and the build clock falsely imply that every page was edited.
  return entries;
}
