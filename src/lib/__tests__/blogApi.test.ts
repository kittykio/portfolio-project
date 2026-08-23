import fs from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getCreatedDate, getModifiedDate } from '@/utils/getDate';
import { getAllPosts, getAllPostsByFilter, getMostPopular, getPaginatedPostList, getPaginatedPostListByFilter, getPostDetail, getSlugs } from '@/lib/blogApi';

jest.mock('fs', () => ({ __esModule: true, default: { existsSync: jest.fn(), promises: { readdir: jest.fn(), lstat: jest.fn(), readFile: jest.fn() } } }));
jest.mock('next-mdx-remote/rsc', () => ({ compileMDX: jest.fn() }));
jest.mock('@/utils/getDate', () => ({ getCreatedDate: jest.fn(), getModifiedDate: jest.fn() }));
jest.mock('@/components/MdxComponents', () => ({}));
jest.mock('@/components/SVGBezier', () => jest.fn());
jest.mock('@/components/Sparkly', () => jest.fn());
jest.mock('rehype-highlight', () => jest.fn()); jest.mock('rehype-slug', () => jest.fn());
jest.mock('remark-gfm', () => jest.fn()); jest.mock('remark-toc', () => jest.fn()); jest.mock('remark-breaks', () => jest.fn());
jest.mock('@/utils/rehypeExtractHeadings', () => jest.fn());
jest.mock('highlight.js/lib/languages/bash', () => jest.fn()); jest.mock('highlight.js/lib/languages/css', () => jest.fn());
jest.mock('highlight.js/lib/languages/dockerfile', () => jest.fn()); jest.mock('highlight.js/lib/languages/javascript', () => jest.fn());
jest.mock('highlight.js/lib/languages/json', () => jest.fn()); jest.mock('highlight.js/lib/languages/markdown', () => jest.fn());
jest.mock('highlight.js/lib/languages/typescript', () => jest.fn()); jest.mock('highlight.js/lib/languages/plaintext', () => jest.fn());
jest.mock('highlight.js/lib/languages/xml', () => jest.fn());

const mockedFs = jest.mocked(fs);
const frontmatter = (date: string, title = date, tags: string[] | string = ['web']) => ({ date, title, description: 'Description', tags, image: '/image.png' });

describe('blog content API', () => {
  beforeEach(() => {
    mockedFs.promises.readdir.mockResolvedValue(['older.mdx', 'folder', 'newer.mdx'] as never);
    mockedFs.promises.lstat.mockImplementation(async (file) => ({ isDirectory: () => String(file).endsWith('folder') }) as never);
    mockedFs.promises.readFile.mockResolvedValue('---\ntitle: Test\n---\nSome readable words.' as never);
    jest.mocked(getCreatedDate).mockReturnValue(new Date('2024-01-01T00:00:00Z'));
    jest.mocked(getModifiedDate).mockReturnValue(new Date('2024-02-01T00:00:00Z'));
    jest.mocked(compileMDX).mockImplementation(async ({ source }) => ({ content: `compiled:${source}`, frontmatter: frontmatter('2024-01-01') }) as never);
  });

  it('lists MDX files and ignores directories', async () => {
    await expect(getSlugs()).resolves.toEqual([['older'], ['newer']]);
  });

  it('returns an empty list when directory reading fails', async () => {
    mockedFs.promises.readdir.mockRejectedValue(new Error('missing'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(getSlugs('ja')).resolves.toEqual([]);
  });

  it.each([[false, '/blog/post.mdx'], [true, '/blog/ja/post.mdx']] as const)('loads the appropriate Japanese fallback path', async (translated, ending) => {
    mockedFs.existsSync.mockReturnValue(translated);
    jest.mocked(compileMDX).mockResolvedValue({ content: 'content', frontmatter: frontmatter('2024-03-01', 'Post', 'solo') } as never);
    const post = await getPostDetail(['post'], 'ja');
    expect(String(mockedFs.promises.readFile.mock.calls.at(-1)?.[0]).endsWith(ending)).toBe(true);
    expect(post).toMatchObject({ slug: ['post'], title: 'Post', tags: ['solo'], like: 0, readingTime: 1, headings: [] });
    expect(post.createdDate).toEqual(new Date('2024-01-01T00:00:00Z'));
  });

  it('sorts all posts by publication date and preserves stable unique IDs', async () => {
    mockedFs.promises.readdir.mockResolvedValue(['older.mdx', 'newer.mdx'] as never);
    jest.mocked(compileMDX)
      .mockResolvedValueOnce({ content: 'old', frontmatter: frontmatter('2023-01-01', 'Old') } as never)
      .mockResolvedValueOnce({ content: 'new', frontmatter: frontmatter('2025-01-01', 'New') } as never);
    const posts = await getAllPosts();
    expect(posts.map(({ title }) => title)).toEqual(['New', 'Old']);
    expect(new Set(posts.map(({ id }) => id))).toHaveProperty('size', 2);
  });

  it('rejects generated ID collisions', async () => {
    mockedFs.promises.readdir.mockResolvedValue(['same.mdx', 'same.mdx'] as never);
    await expect(getAllPosts()).rejects.toThrow('Generated blog post IDs collided');
  });

  it('filters, paginates, and sorts popular posts', async () => {
    mockedFs.promises.readdir.mockResolvedValue(['a.mdx', 'b.mdx', 'c.mdx'] as never);
    jest.mocked(compileMDX)
      .mockResolvedValueOnce({ content: 'a', frontmatter: frontmatter('2025-03-01', 'A', ['react']) } as never)
      .mockResolvedValueOnce({ content: 'b', frontmatter: frontmatter('2025-02-01', 'B', ['art']) } as never)
      .mockResolvedValueOnce({ content: 'c', frontmatter: frontmatter('2025-01-01', 'C', ['react']) } as never);
    expect((await getAllPostsByFilter(['react'])).map(({ title }) => title)).toEqual(['A', 'C']);

    jest.mocked(compileMDX).mockResolvedValue({ content: 'x', frontmatter: frontmatter('2025-01-01') } as never);
    const page = await getPaginatedPostList({ activePage: 2, limit: 2 });
    expect(page).toMatchObject({ total: 3 }); expect(page.posts).toHaveLength(1);
    const filtered = await getPaginatedPostListByFilter({ activePage: 1, limit: 1, tags: ['web'] });
    expect(filtered).toMatchObject({ total: 3 }); expect(filtered.posts).toHaveLength(1);
    const popular = await getMostPopular(2);
    expect(popular).toHaveLength(2);
    await expect(getMostPopular()).resolves.toHaveLength(3);
  });

  it('calculates reading time after removing frontmatter, code, and markup', async () => {
    const words = Array.from({ length: 221 }, () => 'word').join(' ');
    mockedFs.promises.readFile.mockResolvedValue(`---\ntitle: ignored\n---\n\`\`\`js\nignored\n\`\`\`\n<div>x</div> ${words}` as never);
    const post = await getPostDetail(['long']);
    expect(post.readingTime).toBe(2);
  });
});
