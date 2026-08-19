'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { defaultLocale, type Locale } from '@/i18n/config';

type LocaleContextValue = { locale: Locale; isJapanese: boolean };

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  isJapanese: false,
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const locale: Locale = pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en';

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, isJapanese: locale === 'ja' }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
