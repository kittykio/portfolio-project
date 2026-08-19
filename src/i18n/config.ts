export const locales = ['en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const isLocale = (value: string | null | undefined): value is Locale =>
  Boolean(value && locales.includes(value as Locale));

export const getLocalePath = (pathname: string, locale: Locale): string => {
  const englishPath = pathname.replace(/^\/ja(?=\/|$)/, '') || '/';
  return locale === 'ja' ? `/ja${englishPath}` : englishPath;
};
