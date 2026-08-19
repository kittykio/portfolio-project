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

// Defines the properties for the ProjectItem component.
interface ProjectItemProps {
  // The specific project object to be displayed, including like status.
  project: ProjectType;
  // The current list of liked project items.
  likeItemList: ProjectType[];
  // Function to update the list of liked project items.
  setLikeItemList: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  // Callback function to select the project, typically to open a detailed view.
  onSelect: (project: ProjectType) => void;
  // Optional custom class names for the wrapper element.
  className?: string;
}

// A component that displays an individual project item within a card, featuring hover effects and interaction buttons.
const ProjectItem = ({
  project,
  likeItemList,
  setLikeItemList,
  onSelect,
  className,
}: ProjectItemProps) => {
  // State to store the natural dimensions of the loaded image for proper Next.js Image sizing.
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  return (
    // Wrapper component providing a floating or parallax effect to the card.
    <CardFloatWrapper className={className ? className : ''}>
      <Card className="cursor-pointer">
        {/* Placeholder div that displays a pulsating animation while the image is loading. */}
        {!dimensions && <div className="w-full h-48 bg-surface-muted animate-pulse" />}
        <Image
          src={project.image}
          alt={project.title}
          priority
          // Uses determined dimensions or large defaults to maintain aspect ratio and prevent layout shift.
          width={dimensions?.width ?? 1000}
          height={dimensions?.height ?? 1000}
          className="object-cover w-full h-auto"
          // Handler to capture the natural image dimensions once the image is loaded.
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            setDimensions({
              width: target.naturalWidth,
              height: target.naturalHeight,
            });
          }}
        />

        {/* The whole postcard opens its project case file. The overlay controls sit above it. */}
        <button
          type="button"
          aria-label={`Open case file for ${project.title}`}
          onClick={() => { trackEvent('project_open', project.title); onSelect(project); }}
          className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-flame-500 focus-visible:outline-offset-[-4px]"
        />

        {/* Interaction controls overlay, hidden on mobile by default and appears on group hover. */}
        <div className="pointer-events-auto absolute z-10 -bottom-12 left-1/2 flex -translate-x-1/2 scale-100 flex-col items-center opacity-100 transition-transform transition-opacity duration-300 ease-out md:pointer-events-none md:-bottom-14 md:scale-0 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:scale-100 md:group-hover:opacity-100">
          {/* Like button component for toggling the project's like status. */}
          <LikeButton
            likeItem={project}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            updateLike={updateLike}
            activate
            size={28}
            // Prevents the click event from propagating to the parent card selection.
            onClick={(e) => e.stopPropagation()}
          />
          {/* Wrapper component applying a magnetic hover effect to the title/zoom button. */}
          <Magnetic>
            <div
              className="expanding_underline"
              // Handler to open the detailed view of the project.
              onClick={() => { trackEvent('project_open', project.title); onSelect(project); }}
              role="button"
              tabIndex={0}
              // Allows activation with the Enter key for keyboard accessibility.
              onKeyDown={(e) => { if (e.key === 'Enter') { trackEvent('project_open', project.title); onSelect(project); } }}
            >
              <p className="mt-2 flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 text-center font-bodyBold text-content sm:max-w-none">
                {project.title}
                {/* Zoom-in icon indicating the item is clickable for a larger view. */}
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
