import type { Metadata } from 'next';
import AboutThisAppContent from '@/app/about-this-app/AboutThisAppContent';

export const metadata: Metadata = {
  title: 'このアプリについて | Kiki',
  description: 'kiki.devの設計、技術、コンテンツ、分析、公開方法を詳しく紹介します。',
  alternates: { canonical: '/ja/about-this-app' },
};

export default function JapaneseAboutThisAppPage() {
  return <AboutThisAppContent locale="ja" />;
}
