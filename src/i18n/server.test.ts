const get = jest.fn();
jest.mock('next/headers', () => ({ headers: () => ({ get }) }));
import { getRequestLocale } from './server';

it('detects request locale from middleware and route headers', () => {
  get.mockImplementation((name: string) => name === 'x-portfolio-locale' ? 'ja' : null); expect(getRequestLocale()).toBe('ja');
  get.mockImplementation((name: string) => name === 'next-url' ? '/ja/blog' : null); expect(getRequestLocale()).toBe('ja');
  get.mockReturnValue(null); expect(getRequestLocale()).toBe('en');
});
