import type { Metadata } from 'next';
import AboutThisAppContent from './AboutThisAppContent';

export const metadata: Metadata = {
  title: 'About this app | Kiki',
  description: 'A detailed look at how the kiki.dev portfolio is designed, built, measured, and shared.',
  alternates: { canonical: '/about-this-app' },
};

export default function AboutThisAppPage() {
  return <AboutThisAppContent locale="en" />;
}
