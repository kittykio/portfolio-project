/** @jest-environment node */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

it('sets the server-rendered language from the actual URL rather than a supplied locale header', () => {
  for (const [path, locale] of [['/', 'en'], ['/ja', 'ja'], ['/ja/projects/demo', 'ja'], ['/projects/demo', 'en']]) {
    const response = middleware(new NextRequest(`https://kittykio.com${path}`, { headers: { 'x-portfolio-locale': 'untrusted' } }));
    expect(response.headers.get('x-middleware-request-x-portfolio-locale')).toBe(locale);
  }
});
