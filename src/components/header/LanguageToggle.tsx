'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getLocalePath, type Locale } from '@/i18n/config';
import { useLocale } from '@/components/LocaleContext';

const LanguageToggle = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const nextLocale: Locale = locale === 'en' ? 'ja' : 'en';

  return (
    <button
      type="button"
      onClick={() => router.push(getLocalePath(pathname, nextLocale))}
      aria-label={locale === 'en' ? '日本語に切り替える' : 'Switch to English'}
      className="flex items-center rounded-full border border-border p-0.5 text-xs font-bodyBold transition-colors hover:border-flame-500 hover:text-flame-500"
    >
      {(['en', 'ja'] as Locale[]).map((targetLocale) => (
        <span
          key={targetLocale}
          aria-current={locale === targetLocale ? 'page' : undefined}
          className={`rounded-full px-2 py-1 transition-colors ${
            locale === targetLocale
              ? 'bg-flame-500 text-white dark:bg-lemon dark:text-black'
              : 'hover:text-flame-500'
          }`}
        >
          {targetLocale === 'en' ? 'EN' : '日本語'}
        </span>
      ))}
    </button>
  );
};

export default LanguageToggle;
