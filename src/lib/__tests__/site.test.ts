import { getOgCardUrl, getSiteUrl } from '@/lib/site';

describe('site URL helpers', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;
  afterEach(() => { if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = original; });

  it('uses the fallback, adds HTTPS, and accepts complete URLs', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl().toString()).toBe('https://kittykio.com/');
    process.env.NEXT_PUBLIC_SITE_URL = 'portfolio.example';
    expect(getSiteUrl().toString()).toBe('https://portfolio.example/');
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    expect(getSiteUrl().toString()).toBe('http://localhost:3000/');
  });

  it('falls back for an invalid configured URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://%';
    expect(getSiteUrl().hostname).toBe('kittykio.com');
  });

  it('builds encoded localized OG card URLs with optional descriptions', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const url = new URL(getOgCardUrl({ title: 'A & B', description: 'Details', type: 'project', locale: 'ja' }));
    expect(Object.fromEntries(url.searchParams)).toEqual({ title: 'A & B', type: 'project', locale: 'ja', description: 'Details' });
    expect(new URL(getOgCardUrl({ title: 'Home', type: 'site' })).searchParams.has('description')).toBe(false);
  });
});
