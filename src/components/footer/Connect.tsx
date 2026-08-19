'use client';

import { Magnetic } from '../Magnetic';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { useLocale } from '@/components/LocaleContext';

// The Connect component displays contact information and social media links.
const Connect = () => {
  const { locale } = useLocale();
  return (
    // Container for all connection elements, using flex layout for stacking.
    <div className="flex flex-col gap-8 flex-wrap items-center lg:items-start">
      {/* Section title for the connection links. */}
      <p className="font-heading text-lg font-bodyBold text-content">{locale === 'ja' ? 'つながる' : 'Connect'}</p>

      {/* Wrapped email address inside a custom animated button. */}
      <Magnetic>
        <Link href="mailto:modularmanul@gmail.com">
          <p className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border hover:border-none hover:text-gray-100 font-bodyBold hover:bg-flame-500 transition-all shadow-md">
            modularmanul@gmail.com
          </p>
        </Link>
      </Magnetic>

      <Magnetic>
        <Link
          href="https://github.com/kittykio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bodyBold hover:text-flame-500 transition-colors"
        >
          <SiGithub aria-hidden size={24} />
          GitHub
        </Link>
      </Magnetic>
    </div>
  );
};

export default Connect;
