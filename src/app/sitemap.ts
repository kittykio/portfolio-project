import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-project.vercel.app';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  return [...['', '/projects', '/blog', '/now', '/contact', '/resume', '/about-this-app'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })), ...posts.map((post) => ({ url: `${base}/blog/post/${post.slug.join('/')}`, lastModified: post.modifiedDate })), ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: project.modifiedDate }))];
}
