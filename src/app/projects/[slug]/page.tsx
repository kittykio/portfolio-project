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
    openGraph: { title: project.title, description: project.description, images: [{ url: image, width: 1200, height: 630, alt: `${project.title} — Kitty Kio project` }] },
    twitter: { card: 'summary_large_image', title: project.title, description: project.description, images: [image] },
  };
}
export default async function ProjectDetail({ params }: Props) {
  const project = (await getAllProjects(getRequestLocale())).find((item) => item.slug === params.slug);
  if (!project) notFound();
  const sections = [['Problem', `Create a focused, useful experience for ${project.title}.`], ['Role', 'Frontend development, visual direction, and implementation.'], ['Constraints', 'A responsive, accessible interface that stays appropriate for its stack and purpose.'], ['Process', `Design around the core task, then refine interaction and presentation with ${project.tags.join(', ')}.`], ['Result', project.description ?? 'A documented implementation with source and live links.']];
  return <main className="mx-auto mt-32 w-full max-w-5xl px-4 pb-[42rem]"><Link href="/projects" className="font-bodyBold text-flame-500">← Back to projects</Link><h1 className="mt-8 font-flashy text-5xl text-content">{project.title}</h1><p className="mt-4 text-xl">{project.description}</p><Image className="mt-10 w-full rounded-3xl" src={project.image} alt={project.title} width={1200} height={800} priority /><div className="mt-10 grid gap-4 sm:grid-cols-2">{sections.map(([title, body]) => <section key={title} className="rounded-3xl bg-surface-glass p-6"><h2 className="font-heading text-2xl text-flame-500">{title}</h2><p className="mt-3 leading-relaxed">{body}</p></section>)}</div><div className="mt-8 flex gap-4">{project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="font-bodyBold text-flame-500">Live demo</a>}{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className="font-bodyBold text-flame-500">Source code</a>}</div></main>;
}
