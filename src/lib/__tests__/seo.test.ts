import { contentDate, languageAlternates, pageMetadata, serializeJsonLd, staticMetadata, staticPages } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';

const original = process.env.NEXT_PUBLIC_SITE_URL;
beforeEach(() => { process.env.NEXT_PUBLIC_SITE_URL = 'https://kittykio.com/'; });
afterAll(() => { if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = original; });

it('pairs self-canonical localized pages with reciprocal language and social URLs', () => {
  for (const path of Object.keys(staticPages) as (keyof typeof staticPages)[]) {
    const en = staticMetadata(path, 'en'); const ja = staticMetadata(path, 'ja');
    expect(en.alternates?.languages).toEqual(ja.alternates?.languages);
    expect(en.alternates?.canonical).toBe(`https://kittykio.com${path}`);
    expect(ja.alternates?.canonical).toBe(`https://kittykio.com/ja${path === '/' ? '' : path}`);
    expect(ja.openGraph).toMatchObject({ url: ja.alternates?.canonical, locale: 'ja_JP' });
    expect(ja.description).not.toEqual(en.description);
    expect(ja.twitter).toMatchObject({ card: 'summary_large_image' });
  }
});

it('does not advertise untranslated articles or index filter permutations', () => {
  const article = pageMetadata({ title: 'Article', description: 'Content', path: '/blog/post/example', locale: 'ja', translated: false });
  expect(article.alternates?.canonical).toBe('https://kittykio.com/blog/post/example');
  expect(article.alternates?.languages).not.toHaveProperty('ja');
  const filter = pageMetadata({ title: 'Blog', description: 'Posts', path: '/blog', noIndex: true });
  expect(filter.robots).toEqual({ index: false, follow: true });
  expect(filter.alternates?.languages).toBeUndefined();
});

it('normalizes origins and rejects credentials rather than leaking them into metadata', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/path?q=1#fragment';
  expect(getSiteUrl().href).toBe('https://example.com/');
  expect(languageAlternates('/projects').en).toBe('https://example.com/projects');
  process.env.NEXT_PUBLIC_SITE_URL = 'https://user:secret@example.com';
  expect(getSiteUrl().href).toBe('https://kittykio.com/');
});

it('uses valid editorial dates and safely embeds user-authored structured data', () => {
  expect(contentDate('2026/09/15')).toBe('2026-09-15');
  expect(contentDate('2026-02-30')).toBeUndefined();
  expect(contentDate('invalid')).toBeUndefined();
  expect(contentDate()).toBeUndefined();
  const data = { headline: '</script><script>alert(1)</script>日本語' };
  const encoded = serializeJsonLd(data);
  expect(encoded).not.toContain('<');
  expect(JSON.parse(encoded)).toEqual(data);
});
