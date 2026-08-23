import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/[[...slug]]/page';
import PostPage, { generateMetadata as postMetadata, generateStaticParams } from '@/app/blog/post/[...slug]/page';
import ProjectDetail, { generateMetadata as projectMetadata } from '@/app/projects/[slug]/page';
import JapaneseHomePage from '@/app/ja/page';
import JapaneseBlogPage from '@/app/ja/blog/[[...slug]]/page';
import JapanesePostPage from '@/app/ja/blog/post/[...slug]/page';
import JapaneseProjectDetail from '@/app/ja/projects/[slug]/page';

const notFound = jest.fn(() => { throw new Error('not found'); });
const getAllPosts = jest.fn(); const getPostDetail = jest.fn(); const getSlugs = jest.fn(); const getAllProjects = jest.fn();
jest.mock('next/navigation', () => ({ notFound: () => notFound() }));
jest.mock('@/i18n/server', () => ({ getRequestLocale: () => 'en' }));
jest.mock('@/lib/blogApi', () => ({ getAllPosts: (...a: unknown[]) => getAllPosts(...a), getPostDetail: (...a: unknown[]) => getPostDetail(...a), getSlugs: () => getSlugs() }));
jest.mock('@/lib/projectApi', () => ({ getAllProjects: (...a: unknown[]) => getAllProjects(...a) }));
jest.mock('@/app/blog/components/BlogPageClient', () => ({ allPosts, initialTags }: any) => <div>Blog {allPosts.length} {initialTags.join(',')}</div>);
jest.mock('@/app/blog/components/PostDetail', () => ({ post, posts }: any) => <div>Post {post.title} {posts.length}</div>);
jest.mock('@/app/components/HeroSection', () => () => <span>Hero</span>); jest.mock('@/app/components/IntroSection', () => () => <span>Intro</span>); jest.mock('@/app/components/interest-section/InterestSection', () => () => <span>Interest</span>); jest.mock('@/app/components/GetToKnowMeSection', () => () => <span>Know</span>); jest.mock('@/app/components/ProjectSection', () => ({ projects }: any) => <span>Projects {projects.length}</span>); jest.mock('@/app/components/BlogSection', () => ({ posts }: any) => <span>Posts {posts.length}</span>); jest.mock('@/app/components/ExperienceSection', () => () => <span>Experience</span>);

const post = { title: 'Article', description: 'Words', date: '2025-01-01', slug: ['article'] };
const project = { title: 'Project', description: 'Build', slug: 'project', image: '/image.png', tags: ['React'], websiteUrl: 'https://example.com', repoUrl: 'https://github.com/example' };

beforeEach(() => { jest.clearAllMocks(); getAllPosts.mockResolvedValue([post]); getPostDetail.mockResolvedValue(post); getSlugs.mockResolvedValue([['article']]); getAllProjects.mockResolvedValue([project]); });

it('loads blog indexes, details, metadata, and static params in both locales', async () => {
  render(<>{await BlogPage({ params: { slug: ['react'] } })}{await JapaneseBlogPage({ params: {} })}{await PostPage({ params: { slug: ['article'] } })}{await JapanesePostPage({ params: { slug: ['article'] } })}</>);
  expect(screen.getByText('Blog 1 react')).toBeInTheDocument(); expect(screen.getAllByText('Post Article 1')).toHaveLength(2);
  expect(await generateStaticParams()).toEqual([{ slug: ['article'] }]);
  expect((await postMetadata({ params: { slug: ['article'] } })).title).toBe('Article | Kitty Kio');
});

it('renders home and project details while handling missing projects', async () => {
  render(<>{await JapaneseHomePage()}{await ProjectDetail({ params: { slug: 'project' } })}{await JapaneseProjectDetail({ params: { slug: 'project' } })}</>);
  expect(screen.getByText('Posts 1')).toBeInTheDocument(); expect(screen.getAllByText('Project')).not.toHaveLength(0);
  expect((await projectMetadata({ params: { slug: 'project' } })).title).toBe('Project | Kitty Kio');
  expect(await projectMetadata({ params: { slug: 'missing' } })).toEqual({});
  getAllProjects.mockResolvedValueOnce([]); await expect(ProjectDetail({ params: { slug: 'missing' } })).rejects.toThrow('not found'); expect(notFound).toHaveBeenCalled();
});
