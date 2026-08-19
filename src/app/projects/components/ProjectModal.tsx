'use client';

import { Fragment, FC } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import type { ProjectType } from '@/types/ProjectType';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/projectAction';
import { RiCloseCircleFill } from 'react-icons/ri';
import { DisplayTag } from '@/components/Tag';
import ShareButton from '@/components/ShareButton';
import SaveButton from '@/components/SaveButton';
import Link from 'next/link';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectType;
  likeItemList: ProjectType[];
  setLikeItemList: React.Dispatch<React.SetStateAction<ProjectType[]>>;
};

// Small decorative quote SVG
const QuoteSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7.17 6C5.2 6 4 7.43 4 9.5S5.2 13 7.17 13c1.12 0 2.03-.92 2.03-2.04 0-.66-.27-1.28-.71-1.71C8.93 9.3 9 9.1 9 8.83 9 7.36 8 6 7.17 6zm10 0c-1.97 0-3.17 1.43-3.17 3.5S15.2 13 17.17 13c1.12 0 2.03-.92 2.03-2.04 0-.66-.27-1.28-.71-1.71.61.37.68.57.68.84 0-1.47-1-2.83-1.83-2.83z" />
  </svg>
);

const ProjectModal: FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  likeItemList,
  setLikeItemList,
}) => {
  if (!project) return null;
  const currentProject = likeItemList?.find((item) => item.id === project.id) ?? project;
  const caseStudy = [
    ['Problem', `Create a clear, focused experience for ${project.title}.`],
    ['Role', 'Product-minded frontend development, visual direction, and implementation.'],
    ['Constraints', 'Keep the experience responsive, understandable, and appropriate for the chosen stack.'],
    ['Process', `Shape the interface around the core task, then refine interaction and presentation with ${project.tags.join(', ')}.`],
    ['Result', project.description ?? 'A documented implementation with source and live links where available.'],
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        {/* BACKDROP */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-surface-glass-strong backdrop-blur-sm" />
        </TransitionChild>

        {/* PANEL */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl isolate
  bg-surface-glass backdrop-blur-md border border-border/20
  shadow-[inset_1px_1px_2px_var(--shadow-inset-light),inset_-1px_-1px_2px_var(--shadow-inset-dark)]
  drop-shadow-[0_8px_24px_var(--shadow-strong)]
  text-content-muted flex flex-col overflow-hidden"
            >
              {/* Title */}
              <DialogTitle className="text-3xl font-bodyBold text-center p-4">
                <span className="block text-xs uppercase tracking-[0.25em] text-flame-500 mb-2">
                  Project case file
                </span>
                {project.title}
              </DialogTitle>

              {/* Image - fixed section */}
              <div className="w-full flex justify-center px-4">
                <div className="max-h-[50vh] overflow-hidden rounded-2xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={1000}
                    height={1000}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-6 text-content-muted hover:text-flame-500 transition-colors"
              >
                <RiCloseCircleFill size={28} />
              </button>

              {/* Scrollable content */}
              <div
                className="flex flex-col flex-1 overflow-y-auto gap-4 p-4
    scrollbar-thin scrollbar-thumb-[var(--content-soft)]/30 scrollbar-track-transparent"
              >
                {/* Like button aligned right */}
                <div className="flex justify-end w-full items-start">
                  <LikeButton
                    likeItem={currentProject}
                    likeItemList={likeItemList}
                    setLikeItemList={setLikeItemList}
                    updateLike={updateLike}
                    activate
                    size={28}
                    onClick={(e) => e.stopPropagation()}
                    hideBackground
                  />
                </div>
                <div className="flex flex-wrap gap-2"><ShareButton title={project.title} url={`/projects/${project.slug}`} /><SaveButton type="project" id={project.id} title={project.title} href={`/projects/${project.slug}`} /></div>
                <Link href={`/projects/${project.slug}`} onClick={onClose} className="self-start font-bodyBold text-flame-500 underline">Open full case study →</Link>

                {/* Two-column layout */}
                <div className="relative flex flex-row flex-wrap md:flex-nowrap gap-4 justify-between">
                  {/* Left: Description */}
                  {project.description && (
                    <blockquote
                      className="flex-1 min-w-[240px] rounded-2xl p-6 bg-surface-glass backdrop-blur-sm border border-border/20 
        shadow-[inset_2px_2px_6px_var(--shadow-inset-light-soft),inset_-2px_-2px_6px_var(--shadow-inset-dark)] italic relative"
                    >
                      <QuoteSVG className="absolute top-2 left-2 w-6 h-6 text-content-muted" />
                      <QuoteSVG className="absolute bottom-2 right-2 w-6 h-6 text-content-muted rotate-180" />
                      <p className="relative text-sm md:text-xl">{project.description}</p>
                    </blockquote>
                  )}

                  {/* Right: Info & Tags */}
                  <div className="w-auto flex flex-col gap-4 items-end text-sm md:text-xl">
                    <ul
                      className="flex flex-col gap-1 md:gap-2 rounded-2xl p-4 bg-surface-glass backdrop-blur-sm border border-border/20 
        shadow-[inset_2px_2px_6px_var(--shadow-inset-light-soft),inset_-2px_-2px_6px_var(--shadow-inset-dark)]"
                    >
                      <li>
                        <strong>Date:</strong> {project.date}
                      </li>
                      <li className="flex gap-1 flex-wrap">
                        {project.tags.map((tag) => (
                          <DisplayTag key={tag} tag={tag} />
                        ))}
                      </li>
                    </ul>
                    <div className="flex gap-3 flex-wrap justify-end">
                      {project.repoUrl && (
                        <a className="text-flame-500 underline" href={project.repoUrl} target="_blank" rel="noreferrer">
                          Source code
                        </a>
                      )}
                      {project.websiteUrl && (
                        <a className="text-flame-500 underline" href={project.websiteUrl} target="_blank" rel="noreferrer">
                          Live demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <section className="grid gap-3 sm:grid-cols-2">
                  {caseStudy.map(([label, content]) => <article key={label} className="rounded-2xl bg-surface-glass p-4"><h3 className="font-bodyBold text-flame-500">{label}</h3><p className="mt-2 text-sm leading-relaxed">{content}</p></article>)}
                </section>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectModal;
