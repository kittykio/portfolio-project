import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projectApi';
import { getRequestLocale } from '@/i18n/server';
import { getOgCardUrl } from '@/lib/site';

type Props = { params: { slug: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getRequestLocale();
  const project = (await getAllProjects(locale)).find((item) => item.slug === params.slug);
  const pathname = `${locale === 'ja' ? '/ja' : ''}/projects/${params.slug}`;
  if (!project) return {};

  const image = getOgCardUrl({
    title: project.title,
    description: project.description,
    type: 'project',
    locale,
  });

  return {
    title: `${project.title} | Kitty Kio`,
    description: project.description,
    alternates: { canonical: pathname },
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        { url: image, width: 1200, height: 630, alt: `${project.title} — Kitty Kio project` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [image],
    },
  };
}
export default async function ProjectDetail({ params }: Props) {
  const locale = getRequestLocale();
  const project = (await getAllProjects(locale)).find((item) => item.slug === params.slug);
  if (!project) notFound();
  const details = project.caseStudy;
  const labels =
    locale === 'ja'
      ? ['課題', '担当', '制約', 'プロセス', '成果']
      : ['Problem', 'Role', 'Constraints', 'Process', 'Result'];
  const sections = [
    [labels[0], details?.problem ?? `Create a focused, useful experience for ${project.title}.`],
    [labels[1], details?.role ?? 'Frontend development, visual direction, and implementation.'],
    [
      labels[2],
      details?.constraints ??
        'A responsive, accessible interface that stays appropriate for its stack and purpose.',
    ],
    [
      labels[3],
      details?.process ??
        `Design around the core task, then refine interaction and presentation with ${project.tags.join(', ')}.`,
    ],
    [
      labels[4],
      details?.result ??
        project.description ??
        'A documented implementation with source and live links.',
    ],
  ];
  const copy =
    locale === 'ja'
      ? {
          back: 'プロジェクト一覧へ',
          experience: '体験のポイント',
          engineering: '設計とパフォーマンス',
          live: '公開サイト',
          source: 'ソースコード',
        }
      : {
          back: 'Back to projects',
          experience: 'Experience highlights',
          engineering: 'Engineering & performance',
          live: 'Live demo',
          source: 'Source code',
        };

  return (
    <main className="mx-auto mt-32 w-full max-w-6xl px-4 pb-[42rem]">
      <Link
        href={`${locale === 'ja' ? '/ja' : ''}/projects`}
        className="font-bodyBold text-flame-500"
      >
        ← {copy.back}
      </Link>
      <header className="mt-10 max-w-4xl">
        {details?.eyebrow && (
          <p className="text-sm font-bodyBold uppercase tracking-[0.24em] text-flame-500">
            {details.eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-flashy text-5xl text-content sm:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-content-muted">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/30 bg-surface-glass px-3 py-1 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      <Image
        className="mt-12 aspect-[3/2] w-full rounded-3xl object-cover shadow-2xl"
        src={project.image}
        alt={project.title}
        width={1200}
        height={800}
        priority
      />
      {details?.statement && (
        <blockquote className="mx-auto my-14 max-w-4xl text-center font-heading text-3xl leading-snug text-content sm:text-5xl">
          “{details.statement}”
        </blockquote>
      )}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {sections.map(([title, body], index) => (
          <section
            key={title}
            className={`rounded-3xl border border-border/20 bg-surface-glass p-6 ${index === sections.length - 1 ? 'sm:col-span-2' : ''}`}
          >
            <p className="text-xs font-bodyBold uppercase tracking-[0.2em] text-flame-500">
              0{index + 1}
            </p>
            <h2 className="mt-2 font-heading text-2xl text-content">{title}</h2>
            <p className="mt-3 leading-relaxed text-content-muted">{body}</p>
          </section>
        ))}
      </div>
      {(details?.features?.length || details?.engineering?.length) && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {details?.features?.length && (
            <section>
              <h2 className="font-heading text-3xl text-content">{copy.experience}</h2>
              <ul className="mt-5 space-y-3">
                {details.features.map((feature) => (
                  <li key={feature} className="flex gap-3 rounded-2xl bg-surface-glass p-4">
                    <span aria-hidden className="text-flame-500">
                      ✦
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {details?.engineering?.length && (
            <section>
              <h2 className="font-heading text-3xl text-content">{copy.engineering}</h2>
              <ul className="mt-5 space-y-3">
                {details.engineering.map((decision) => (
                  <li key={decision} className="flex gap-3 rounded-2xl bg-surface-glass p-4">
                    <span aria-hidden className="text-flame-500">
                      →
                    </span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
      <div className="mt-12 flex flex-wrap gap-4">
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-flame-500 px-6 py-3 font-bodyBold text-white"
          >
            {copy.live} ↗
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-flame-500 px-6 py-3 font-bodyBold text-flame-500"
          >
            {copy.source} ↗
          </a>
        )}
      </div>
    </main>
  );
}
