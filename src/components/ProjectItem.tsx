'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Magnetic } from '@/components/Magnetic';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import { ProjectType } from '@/types/ProjectType';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/projectAction';
import { BiSolidZoomIn } from 'react-icons/bi';
import { trackEvent } from '@/components/AnalyticsEvent';

interface ProjectItemProps {
  project: ProjectType;
  likeItemList: ProjectType[];
  setLikeItemList: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  onSelect: (project: ProjectType) => void;
  className?: string;
}

const ProjectItem = ({
  project,
  likeItemList,
  setLikeItemList,
  onSelect,
  className,
}: ProjectItemProps) => {
  // Natural dimensions avoid distorting project artwork whose aspect ratios vary by source.
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  return (
    <CardFloatWrapper className={className ? className : ''}>
      <Card className="cursor-pointer">
        {project.livePreview && project.websiteUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
            <iframe
              src={project.websiteUrl}
              title={`Live preview of ${project.title}`}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
              className="pointer-events-none absolute left-0 top-0 h-[133.333%] w-[133.333%] origin-top-left scale-75 border-0"
            />
            <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bodyBold text-white backdrop-blur-sm">
              Live preview
            </span>
          </div>
        ) : (
          <>
            {!dimensions && <div className="w-full h-48 bg-surface-muted animate-pulse" />}
            <Image
              src={project.image}
              alt={project.title}
              priority
              width={dimensions?.width ?? 1000}
              height={dimensions?.height ?? 1000}
              className="aspect-[4/3] w-full object-cover"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                setDimensions({
                  width: target.naturalWidth,
                  height: target.naturalHeight,
                });
              }}
            />
            {project.websiteUrl && (
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bodyBold text-white backdrop-blur-sm">
                Live preview unavailable
              </span>
            )}
          </>
        )}

        {/* Keep the full-card target separate from overlay controls to preserve valid button markup. */}
        <button
          type="button"
          aria-label={`Open case file for ${project.title}`}
          onClick={() => {
            trackEvent('project_open', project.title);
            onSelect(project);
          }}
          className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-flame-500 focus-visible:outline-offset-[-4px]"
        />

        <div className="pointer-events-auto absolute z-10 -bottom-12 left-1/2 flex -translate-x-1/2 scale-100 flex-col items-center opacity-100 transition-transform transition-opacity duration-300 ease-out md:pointer-events-none md:-bottom-14 md:scale-0 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:scale-100 md:group-hover:opacity-100">
          <LikeButton
            likeItem={project}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            updateLike={updateLike}
            activate
            size={28}
            onClick={(e) => e.stopPropagation()}
          />
          <Magnetic>
            <div
              className="expanding_underline"
              onClick={() => {
                trackEvent('project_open', project.title);
                onSelect(project);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  trackEvent('project_open', project.title);
                  onSelect(project);
                }
              }}
            >
              <p className="mt-2 flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 text-center font-bodyBold text-content sm:max-w-none">
                {project.title}
                <BiSolidZoomIn />
              </p>
            </div>
          </Magnetic>
        </div>
      </Card>
    </CardFloatWrapper>
  );
};

export default ProjectItem;
