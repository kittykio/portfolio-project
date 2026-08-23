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
    <header className="z-30 fixed top-0 left-0 flex h-[72px] w-full items-center justify-between bg-surface-glass-strong px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <Link href={getLocalePath('/', locale)} className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="h-9 w-9 shrink-0">
          <CatLogo />
        </div>
        <p className="whitespace-nowrap text-2xl font-flashy text-content sm:text-[30px]">Kitty Kio</p>
      </Link>

      <nav className="hidden md:flex text-2xl font-heading gap-6 items-center">
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

      <div className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-3 md:hidden">
        <LanguageToggle />
        <MotionToggle compact />
        <div className="flex items-center justify-center scale-90">
          <ThemeToggle size={40} />
        </div>

        <button
          className=" text-[30px]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 w-full bg-canvas flex flex-col items-center gap-6 py-8 px-4 border-t border-border md:hidden z-30"
          >
            {navigation.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.label}
                  href={nav.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 text-xl uppercase hover:text-flame-500 transition"
                >
                  <Icon size={28} />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
