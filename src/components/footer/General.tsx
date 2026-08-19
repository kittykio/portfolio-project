'use client';

import Link from 'next/link';
import { Magnetic } from '../Magnetic';
import { useLocale } from '@/components/LocaleContext';
import { getLocalePath } from '@/i18n/config';

const General = () => {
  const { locale } = useLocale();
  const copy = locale === 'ja'
    ? { title: 'メニュー', home: 'ホーム', about: 'Kikiについて', app: 'このアプリについて', work: 'できること', projects: 'プロジェクト', blog: 'ブログ', now: 'いま', saved: '保存済み', contact: '相談' }
    : { title: 'General', home: 'Home', about: 'About Kiki', app: 'About this app', work: 'Areas of Work', projects: 'Projects', blog: 'Blog', now: 'Now', saved: 'Saved', contact: 'Contact' };

  return (
    <div className="flex flex-col gap-8 flex-wrap items-center lg:items-start">
      <p className="font-heading text-lg font-bodyBold text-content">{copy.title}</p>
      <ul className="flex flex-col gap-4 uppercase items-center lg:items-start">
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/', locale)}>{copy.home}</Link>
          </Magnetic>
        </li>
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={`${getLocalePath('/', locale)}#get-to-know-me`}>{copy.about}</Link>
          </Magnetic>
        </li>
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/about-this-app', locale)}>{copy.app}</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={`${getLocalePath('/', locale)}#what-i-make`}>{copy.work}</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/projects', locale)}>{copy.projects}</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/blog', locale)}>{copy.blog}</Link>
          </Magnetic>
        </li>
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/now', locale)}>{copy.now}</Link>
          </Magnetic>
        </li>
        <li className="hover:text-flame-500"><Magnetic><Link href={getLocalePath('/saved', locale)}>{copy.saved}</Link></Magnetic></li>
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href={getLocalePath('/contact', locale)}>{copy.contact}</Link>
          </Magnetic>
        </li>
      </ul>
    </div>
  );
};

export default General;
