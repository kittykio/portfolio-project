'use client';

import Link from 'next/link';
import {
  RiArticleFill,
  RiArticleLine,
  RiCodeBoxFill,
  RiCodeBoxLine,
  RiMailLine,
  RiPulseFill,
  RiPulseLine,
} from 'react-icons/ri';
import { useThemeContext } from '@/components/ThemeContext';
import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import ThemeToggle from '@/components/header/ThemeToggle';
import LanguageToggle from '@/components/header/LanguageToggle';
import { MotionToggle } from '@/components/MotionPreference';
import CommandPalette from '@/components/CommandPalette';
import SavedLink from '@/components/SavedLink';
import CatLogo from '../CatLogo';
import { useLocale } from '@/components/LocaleContext';
import { getLocalePath } from '@/i18n/config';

const Header = () => {
  const { resolvedTheme } = useThemeContext();
  const { locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const themeForIcon = mounted ? resolvedTheme : 'light';

  type Navigation = {
    label: string;
    href: string;
    icon: IconType;
  };

  // Icon variants depend on the resolved client theme; rendering waits until hydration below.
  const navigation: Navigation[] = [
    {
      label: locale === 'ja' ? 'プロジェクト' : 'projects',
      href: getLocalePath('/projects', locale),
      icon: themeForIcon === 'light' ? RiCodeBoxLine : RiCodeBoxFill,
    },
    {
      label: locale === 'ja' ? 'ブログ' : 'blog',
      href: getLocalePath('/blog', locale),
      icon: themeForIcon === 'light' ? RiArticleLine : RiArticleFill,
    },
    {
      label: locale === 'ja' ? 'いま' : 'now',
      href: getLocalePath('/now', locale),
      icon: themeForIcon === 'light' ? RiPulseLine : RiPulseFill,
    },
    {
      label: locale === 'ja' ? '相談' : 'contact',
      href: getLocalePath('/contact', locale),
      icon: RiMailLine,
    },
  ];

  if (!mounted) return null;

  return (
    <header className="fixed left-0 top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-border/60 bg-surface-glass-strong px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <Link href={getLocalePath('/', locale)} className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="h-9 w-9 shrink-0">
          <CatLogo />
        </div>
        <p className="truncate text-2xl font-flashy text-content sm:text-[30px]">Kitty Kio</p>
      </Link>

      <nav aria-label="Primary navigation" className="hidden items-center gap-5 font-heading text-xl xl:flex 2xl:gap-6 2xl:text-2xl">
        {navigation.map((nav) => {
          const Icon = nav.icon;
          return (
            <Link
              key={nav.label}
              href={nav.href}
              className="flex items-center justify-center gap-2 uppercase hover:text-flame-500 transition"
            >
              <Icon size={28} />
              <span>{nav.label}</span>
            </Link>
          );
        })}
        <LanguageToggle />
        <MotionToggle />
        <CommandPalette />
        <SavedLink />
        <div className="flex items-center justify-center">
          <ThemeToggle size={40} />
        </div>
      </nav>

      <div className="flex shrink-0 items-center xl:hidden">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-canvas/70 text-[28px] text-content transition-colors hover:border-flame-500 hover:text-flame-500"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 top-full z-30 flex max-h-[calc(100dvh-72px)] w-full flex-col overflow-y-auto border-t border-border bg-canvas px-4 py-5 shadow-xl xl:hidden sm:px-6"
          >
            <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
              {navigation.map((nav) => {
                const Icon = nav.icon;
                return (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-14 items-center gap-4 rounded-xl px-4 text-xl font-heading uppercase transition-colors hover:bg-surface hover:text-flame-500"
                  >
                    <Icon size={28} />
                    <span>{nav.label}</span>
                  </Link>
                );
              })}

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border px-2 pt-5">
                <LanguageToggle />
                <MotionToggle compact />
                <CommandPalette />
                <SavedLink />
                <div className="ml-auto flex items-center justify-center">
                  <ThemeToggle size={40} />
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
