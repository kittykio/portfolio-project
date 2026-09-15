import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getOgCardUrl, getSiteUrl } from './site';

export const absoluteUrl = (path: string) => new URL(path, getSiteUrl()).toString();
export const localizedPath = (path: string, locale: Locale) =>
  locale === 'ja' ? `/ja${path === '/' ? '' : path}` : path;
export const languageAlternates = (path: string, translated = true) => ({
  en: absoluteUrl(path),
  ...(translated ? { ja: absoluteUrl(localizedPath(path, 'ja')) } : {}),
  'x-default': absoluteUrl(path),
});

export function pageMetadata({ title, description, path, locale = 'en', type = 'site', translated = true, noIndex = false, publishedTime }: {
  title: string; description: string; path: string; locale?: Locale;
  type?: 'site' | 'post' | 'project'; translated?: boolean; noIndex?: boolean; publishedTime?: string;
}): Metadata {
  const canonical = absoluteUrl(localizedPath(path, locale === 'ja' && !translated ? 'en' : locale));
  const image = getOgCardUrl({ title, description, type, locale });
  return {
    title: `${title} | Kitty Kio`, description,
    alternates: { canonical, ...(!noIndex ? { languages: languageAlternates(path, translated) } : {}) },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title, description, url: canonical, siteName: 'Kitty Kio',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      ...(translated ? { alternateLocale: [locale === 'ja' ? 'en_US' : 'ja_JP'] } : {}),
      type: type === 'post' ? 'article' : 'website',
      ...(type === 'post' ? { publishedTime, authors: [absoluteUrl('/')] } : {}),
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — Kitty Kio` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export const staticPages = {
  '/': {
    en: ['Creative Developer', 'Explore Kitty Kio’s web applications, interactive experiments, creative coding, and technical writing. See project case studies and full-stack development work.'],
    ja: ['クリエイティブデベロッパー', 'Kitty KioのWebアプリ、インタラクティブな実験、クリエイティブコーディング、技術記事を紹介。制作事例やフルスタック開発の取り組みをご覧ください。'],
  },
  '/projects': { en: ['Projects', 'Explore web applications and creative experiments by Kitty Kio, with project case studies, implementation details, live demos, and source code.'], ja: ['プロジェクト', 'Kitty Kioが制作したWebアプリや実験的な作品を紹介。制作背景、実装の工夫、公開デモ、ソースコードをご覧ください。'] },
  '/blog': { en: ['Technical Blog', 'Notes and tutorials from Kitty Kio on web development, creative coding, developer tools, and lessons learned while building applications.'], ja: ['技術ブログ', 'Web開発、クリエイティブコーディング、開発ツール、アプリ制作で学んだことをまとめたKitty Kioの技術記事。'] },
  '/now': { en: ['Now', 'What Kitty Kio is working on, exploring, and learning now: full-stack development, creative experiments, and work in progress.'], ja: ['いま取り組んでいること', 'Kitty Kioがいま取り組むフルスタック開発、制作中の実験、学びや関心について紹介します。'] },
  '/lab': { en: ['Creative Lab', 'Explore Kitty Kio’s current experiments, learning notes, and works in progress across development and interactive design.'], ja: ['クリエイティブラボ', 'Kitty Kioによる開発とインタラクティブデザインの実験、学習ノート、制作途中のアイデアを紹介します。'] },
  '/resume': { en: ['Résumé', 'Kitty Kio’s development experience, skills, and professional background, from frontend interfaces to full-stack applications.'], ja: ['履歴書', 'フロントエンドからフルスタックのアプリ開発まで、Kitty Kioの実務経験、スキル、経歴を紹介します。'] },
  '/contact': { en: ['Contact', 'Get in touch with Kitty Kio about a web development project or collaboration. Share your goals, scope, and timeline.'], ja: ['お問い合わせ', 'Web開発やコラボレーションのご相談はこちら。プロジェクトの目的、範囲、スケジュールをお知らせください。'] },
  '/about-this-app': { en: ['About This Portfolio', 'How Kitty Kio’s portfolio is built: its design, architecture, accessibility, content system, analytics, and deployment.'], ja: ['このポートフォリオについて', 'Kitty Kioのポートフォリオのデザイン、構成、アクセシビリティ、コンテンツ管理、分析、デプロイについて紹介します。'] },
} as const;

export function staticMetadata(path: keyof typeof staticPages, locale: Locale = 'en') {
  const [title, description] = staticPages[path][locale];
  const metadata = pageMetadata({ title, description, path, locale });
  if (path === '/') {
    const homepageTitle = `Kitty Kio | ${title}`;
    metadata.title = homepageTitle;
    metadata.openGraph = { ...metadata.openGraph, title: homepageTitle };
    metadata.twitter = { ...metadata.twitter, title: homepageTitle };
  }
  return metadata;
}

/** Only explicit content dates belong in search metadata, never deployment file times. */
export function contentDate(value?: string): string | undefined {
  if (!value) return undefined;
  const match = value.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (!match) return undefined;
  const iso = `${match[1]}-${match[2]}-${match[3]}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : undefined;
}

export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
export const person = () => ({ '@type': 'Person', '@id': absoluteUrl('/#person'), name: 'Kitty Kio', url: absoluteUrl('/'), sameAs: ['https://github.com/kittykio'] });
export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
});
