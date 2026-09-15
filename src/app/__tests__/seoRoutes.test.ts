import sitemap from '@/app/sitemap';
import { generateMetadata as japaneseProjectMetadata } from '@/app/ja/projects/[slug]/page';
import { generateMetadata as japanesePostMetadata } from '@/app/ja/blog/post/[...slug]/page';
import { metadata as savedMetadata } from '@/app/saved/layout';
import { metadata as insightsMetadata } from '@/app/insights/layout';

jest.mock('@/i18n/server', () => ({ getRequestLocale: () => 'ja' }));
jest.mock('@/lib/contentSeo', () => ({ hasJapanesePost: (slug: string[]) => slug[0] === 'translated' }));
jest.mock('@/lib/blogApi', () => ({
  getSlugs: async () => [['translated'], ['english-only']],
  getAllPosts: async () => [{ slug: ['translated'] }, { slug: ['english-only'] }],
  getPostDetail: async () => ({ title: '記事', description: '説明', date: '2026/09/15' }),
}));
jest.mock('@/lib/projectApi', () => ({ getAllProjects: async () => [{ slug: 'demo', title: '作品', description: '紹介' }] }));
jest.mock('@/app/blog/components/PostDetail', () => () => null);

it('includes only canonical translated URLs with matching hreflang sets and no fake timestamps', async () => {
  const entries = await sitemap();
  const en = entries.find(e => e.url.endsWith('/blog/post/translated'))!;
  const ja = entries.find(e => e.url.endsWith('/ja/blog/post/translated'))!;
  expect(en.alternates).toEqual(ja.alternates);
  expect(entries.some(e => e.url.endsWith('/ja/blog/post/english-only'))).toBe(false);
  expect(entries.some(e => /\/(saved|insights)$/.test(e.url))).toBe(false);
  expect(entries.every(e => e.lastModified === undefined)).toBe(true);
  expect(new Set(entries.map(e => e.url)).size).toBe(entries.length);
});

it('exports Japanese detail metadata and marks private utility pages noindex', async () => {
  expect((await japaneseProjectMetadata({ params: { slug: 'demo' } })).alternates?.canonical).toContain('/ja/projects/demo');
  const post = await japanesePostMetadata({ params: { slug: ['translated'] } });
  expect(post.alternates?.canonical).toContain('/ja/blog/post/translated');
  expect(post.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-09-15' });
  expect((await japanesePostMetadata({ params: { slug: ['english-only'] } })).alternates?.canonical).not.toContain('/ja/');
  expect(savedMetadata.robots.index).toBe(false);
  expect(insightsMetadata.robots.index).toBe(false);
});
