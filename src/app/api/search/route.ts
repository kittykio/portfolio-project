import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blogApi';
import { getAllProjects } from '@/lib/projectApi';
export async function GET(request: NextRequest) { const locale = request.nextUrl.searchParams.get('locale') === 'ja' ? 'ja' : 'en'; const [posts, projects] = await Promise.all([getAllPosts(locale), getAllProjects(locale)]); return NextResponse.json({ posts: posts.map((post) => ({ label: post.title, href: `${locale === 'ja' ? '/ja' : ''}/blog/post/${post.slug.join('/')}`, kind: 'Post' })), projects: projects.map((project) => ({ label: project.title, href: `${locale === 'ja' ? '/ja' : ''}/projects/${project.slug}`, kind: 'Project' })) }); }
