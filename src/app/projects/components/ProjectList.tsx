'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import type { ProjectType } from '@/types/ProjectType';
import ProjectModal from './ProjectModal';
import ProjectItem from '@/components/ProjectItem';
import { getStoredLikes } from '@/utils/likes';

type ProjectListProps = {
  projects: ProjectType[];
  onLikesChange?: (projects: ProjectType[]) => void;
};

const ProjectList: FC<ProjectListProps> = ({ projects, onLikesChange }) => {
  const [mounted, setMounted] = useState(false);
  const [likeItemList, setLikeItemList] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType>(null!);
  const lastReportedLikes = useRef('');

  useEffect(() => {
    const enriched = projects.map((project) => ({
      ...project,
      likesPerUser: getStoredLikes('project', project.id),
    }));
    // Client-only localStorage hydration needs one reconciliation pass after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLikeItemList(enriched);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [projects]);

  useEffect(() => {
    const signature = likeItemList.map((project) => `${project.id}:${project.like}`).join('|');
    if (!signature || signature === lastReportedLikes.current) return;

    lastReportedLikes.current = signature;
    onLikesChange?.(likeItemList);
  }, [likeItemList, onLikesChange]);

  if (!mounted || projects.length === 0) return null;

  return (
    <>
      <motion.div
        className="columns-1 gap-8 px-0 sm:columns-2 sm:gap-10 sm:px-4 lg:gap-12 lg:px-8"
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
      >
        {likeItemList.map((project, i) => (
          <motion.div
            key={project.id}
            className="relative w-full break-inside-avoid group pb-28 sm:pb-36"
            variants={fadeIn('up', 'spring', i * 0.1, 1)}
          >
            <ProjectItem
              key={i}
              project={project}
              likeItemList={likeItemList}
              setLikeItemList={setLikeItemList}
              onSelect={setSelectedProject}
            />
          </motion.div>
        ))}
      </motion.div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null!)}
        project={selectedProject}
        likeItemList={likeItemList}
        setLikeItemList={setLikeItemList}
      />
    </>
  );
};

export default ProjectList;
