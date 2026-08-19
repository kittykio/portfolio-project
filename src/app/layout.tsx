import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import '@/styles/_variables.scss';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

import {
  heading,
  body,
  bodyBold,
  flashy,
  drool,
  awkward,
  spacey,
  playful,
  saucy,
  loud,
} from '@/constants/fonts';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import ScrollSlider from '@/components/scroll-slider/ScrollSlider';
import ThemeContextProvider from '@/components/ThemeContext';
import { ThemeProvider } from 'next-themes';
import { LocaleProvider } from '@/components/LocaleContext';
import { getRequestLocale } from '@/i18n/server';
import AskKiki from '@/components/AskKiki';
import { MotionPreferenceProvider } from '@/components/MotionPreference';
import { getOgCardUrl, getSiteUrl } from '@/lib/site';

const GA_TAG_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  manifest: '/favicon_io/site.webmanifest',
  title: 'Kitty Kio | Creative Developer & Artist',
  description: 'Kitty Kio’s creative developer portfolio, art, experiments, projects, and technical writing.',
  keywords: [
    'Developer Portfolio',
    'Web Development',
    'Creative Coding',
    'Blog',
    'Portfolio',
    'Creative Process',
    'Artistic Journey',
    'Full Stack Developer',
  ],
  authors: [{ name: 'Kitty Kio' }],
  creator: 'Kitty Kio',
  publisher: 'Kitty Kio',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Kitty Kio | Creative Developer & Artist',
    description: 'Projects, art, experiments, and technical writing by Kitty Kio.',
    type: 'website',
    images: [
      {
        url: getOgCardUrl({
          title: 'Kitty Kio — creative developer & artist',
          description: 'Projects, art, experiments, and technical writing by Kitty Kio.',
          type: 'site',
        }),
        width: 1200,
        height: 630,
        alt: 'Kitty Kio creative developer and artist portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitty Kio | Creative Developer & Artist',
    description: 'Projects, art, experiments, and technical writing by Kitty Kio.',
    images: [
      getOgCardUrl({
        title: 'Kitty Kio — creative developer & artist',
        description: 'Projects, art, experiments, and technical writing by Kitty Kio.',
        type: 'site',
      }),
    ],
  },
};

export const viewport = 'width=device-width, initial-scale=1';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = getRequestLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${bodyBold.variable} ${flashy.variable} ${drool.variable} ${awkward.variable} ${spacey.variable} ${playful.variable} ${saucy.variable} ${loud.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <ThemeContextProvider>
            <LocaleProvider>
              <MotionPreferenceProvider>
              <div className="font-body bg-canvas min-h-screen flex flex-col">
                {/* Header */}
                <Header />

                {/* Main content fills remaining space */}
                <main className="flex-1 w-full min-h-[calc(100vh-64px)] flex flex-col items-center mt-16">
                  <ScrollSlider>{children}</ScrollSlider>
                </main>
                {/* Footer always at bottom */}
                <Footer />
                <AskKiki />
              </div>
              </MotionPreferenceProvider>
            </LocaleProvider>
          </ThemeContextProvider>
          {GA_TAG_ID && <GoogleAnalytics gaId={GA_TAG_ID} />}
          <VercelAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
