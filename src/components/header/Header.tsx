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

// The main Header component, providing site navigation and theme toggling.
const Header = () => {
  // Retrieves the current theme state (light/dark) to select appropriate icons.
  const { resolvedTheme } = useThemeContext();
  const { locale } = useLocale();
  // State to control the open/closed status of the mobile navigation menu.
  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // This runs only on the client after initial render/hydration
    setMounted(true);
  }, []);

  const themeForIcon = mounted ? resolvedTheme : 'light';

  // Defines the structure for a navigation item.
  type Navigation = {
    label: string;
    href: string;
    icon: IconType;
  };

  // The array of navigation links, using theme-dependent icons.
  const navigation: Navigation[] = [
    {
      label: locale === 'ja' ? 'プロジェクト' : 'projects',
      href: getLocalePath('/projects', locale),
      // Selects the filled or outlined icon based on the current theme for contrast.
      icon: themeForIcon === 'light' ? RiCodeBoxLine : RiCodeBoxFill,
    },
    {
      label: locale === 'ja' ? 'ブログ' : 'blog',
      href: getLocalePath('/blog', locale),
      // Selects the filled or outlined icon based on the current theme for contrast.
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
    // The fixed header container with blur effect and consistent height.
    <header className="z-30 fixed top-0 left-0 flex h-[72px] w-full items-center justify-between bg-surface-glass-strong px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Logo link, navigates to the homepage. */}
      <Link href={getLocalePath('/', locale)} className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="h-9 w-9 shrink-0">
          <CatLogo />
        </div>
        <p className="whitespace-nowrap text-2xl font-flashy text-content sm:text-[30px]">Kitty Kio</p>
      </Link>

      {/* Desktop Navigation - Hidden on mobile screens. */}
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
        {/* Theme toggle for desktop view. */}
        <LanguageToggle />
        <MotionToggle />
        <CommandPalette />
        <SavedLink />
        <div className="flex items-center justify-center">
          <ThemeToggle size={40} />
        </div>
      </nav>

      {/* Mobile Header Right Section - Contains theme toggle and menu button. */}
      <div className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-3 md:hidden">
        <LanguageToggle />
        <MotionToggle compact />
        {/* Theme toggle for mobile view. */}
        <div className="flex items-center justify-center scale-90">
          <ThemeToggle size={40} />
        </div>

        {/* Mobile menu toggle button. */}
        <button
          className=" text-[30px]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {/* Displays the hamburger or close icon based on menu state. */}
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu Content - Uses AnimatePresence for smooth entry/exit animations. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            // Defines the initial state for the animation.
            initial={{ opacity: 0, y: -10 }}
            // Defines the animated state.
            animate={{ opacity: 1, y: 0 }}
            // Defines the exit state for the animation.
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            // Styling for the full-width dropdown menu.
            className="absolute top-full left-0 w-full bg-canvas flex flex-col items-center gap-6 py-8 px-4 border-t border-border md:hidden z-30"
          >
            {navigation.map((nav) => {
              const Icon = nav.icon;
              return (
                // Individual mobile navigation link.
                <Link
                  key={nav.label}
                  href={nav.href}
                  // Closes the menu when a link is clicked.
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
