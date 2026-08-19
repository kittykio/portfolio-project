import { headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

/** Returns the locale supplied by the /ja rewrite middleware. */
export const getRequestLocale = (): Locale => {
  const requestHeaders = headers();
  const locale = requestHeaders.get('x-portfolio-locale');
  if (isLocale(locale)) return locale;

  // App Router exposes the requested path through one of these headers when
  // there is no locale middleware rewrite (for example, on a direct /ja URL).
  const pathname = requestHeaders.get('x-invoke-path') || requestHeaders.get('next-url') || '';
  return pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : defaultLocale;
};
