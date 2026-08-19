'use client';

import Link from 'next/link';
import SectionWrapper from '@/components/SectionWrapper';
import { useLocale } from '@/components/LocaleContext';

export default function ResumePage() {
  const { locale } = useLocale();
  const ja = locale === 'ja';
  return (
    <SectionWrapper
      title={ja ? '履歴書' : 'Résumé'}
      subtitle={
        ja
          ? 'フルスタック開発と表現豊かなフロントエンドに取り組むKikiの概要。'
          : 'A one-page overview of Kitty Kio’s full-stack and creative frontend work.'
      }
      className="mx-auto mt-24 w-full max-w-4xl px-4 pb-[42rem]"
    >
      <article className="resume-sheet rounded-3xl bg-canvas p-8 shadow-[0_16px_40px_var(--shadow)] sm:p-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-flashy text-5xl text-flame-500">Kitty Kio</h2>
            <p className="mt-2 max-w-2xl">
              {ja
                ? '実用的で、人らしく、記憶に残るウェブ体験をつくるフルスタックデベロッパー。'
                : 'Full-stack developer creating useful, human, and memorable web experiences.'}
            </p>
          </div>
          <p className="font-bodyBold">
            modularmanul@gmail.com
            <br />
            github.com/kittykio
          </p>
        </div>
        <section className="mt-10">
          <h3 className="font-heading text-2xl text-flame-500">Experience</h3>
          <div className="mt-4 space-y-5">
            <div>
              <p className="font-bodyBold">Frontend Developer · Mobile & Internet Services</p>
              <p>
                2024–Present · Responsive React and Next.js interfaces, interaction systems, and
                shared UI foundations.
              </p>
            </div>
            <div>
              <p className="font-bodyBold">
                Backend Developer · Geographic & Spatial Information Services
              </p>
              <p>
                2022–2024 · Data workflows, automation, internal web tools, and cross-functional
                product development.
              </p>
            </div>
          </div>
        </section>
        <section className="mt-10">
          <h3 className="font-heading text-2xl text-flame-500">Skills</h3>
          <p className="mt-3">
            React · Next.js · TypeScript · Node.js · Python · Django · MongoDB · Tailwind CSS ·
            Three.js · Figma
          </p>
        </section>
      </article>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="rounded-full bg-flame-500 px-6 py-3 font-bodyBold text-white dark:bg-lemon dark:text-black"
        >
          {ja ? 'PDFとして保存' : 'Download as PDF'}
        </button>
        <Link
          href={locale === 'ja' ? '/ja/contact' : '/contact'}
          className="rounded-full border border-border px-6 py-3 font-bodyBold hover:border-flame-500 hover:text-flame-500"
        >
          {ja ? '相談する' : 'Contact / Hire me'}
        </Link>
      </div>
    </SectionWrapper>
  );
}
