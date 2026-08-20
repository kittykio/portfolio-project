const fallbackSiteUrl = 'https://kittykio.com';

export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configuredUrl
    ? configuredUrl.startsWith('http')
      ? configuredUrl
      : `https://${configuredUrl}`
    : fallbackSiteUrl;

  try {
    return new URL(candidate);
  } catch {
    return new URL(fallbackSiteUrl);
  }
};

type OgCardOptions = {
  title: string;
  description?: string;
  type: 'site' | 'project' | 'post';
  locale?: 'en' | 'ja';
};

export const getOgCardUrl = ({ title, description, type, locale = 'en' }: OgCardOptions) => {
  const url = new URL('/api/og', getSiteUrl());
  url.searchParams.set('title', title);
  url.searchParams.set('type', type);
  url.searchParams.set('locale', locale);
  if (description) url.searchParams.set('description', description);
  return url.toString();
};
