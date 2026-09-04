'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import type { ProjectType } from '@/types/ProjectType';
import ProjectModal from '@/app/projects/components/ProjectModal';
import ProjectItem from '@/components/ProjectItem';
import { getStoredLikes } from '@/utils/likes';
import { useLocale } from '@/components/LocaleContext';

interface MarqueeRowProps {
  projects: ProjectType[];
  likeItemList: ProjectType[];
  setLikeItemList: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  reverse?: boolean;
  onSelect: (project: ProjectType) => void;
}

const MarqueeRow = ({
  projects,
  likeItemList,
  setLikeItemList,
  reverse = false,
  onSelect,
}: MarqueeRowProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateWidth = () => setRowWidth(element.scrollWidth / 2 || 0);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const orderedProjects = reverse ? projects.slice().reverse() : projects;
  const rowItems = [...orderedProjects, ...orderedProjects];
  const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

  const startMarquee = async (fromX = 0) => {
    if (rowWidth <= 0) return;
    x.set(fromX);
    await controls.start({
      x: [fromX, reverse ? 0 : -rowWidth],
      transition: { repeat: Infinity, repeatType: 'loop', ease: 'linear', duration: 100 },
    });
  };

  useEffect(() => {
    if (rowWidth > 0) void startMarquee(reverse ? -rowWidth : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowWidth, reverse]);

  const resumeMarquee = () => {
    if (rowWidth <= 0) return void startMarquee(0);
    const currentX = x.get();
    const fromX = reverse ? -rowWidth + modulo(currentX, rowWidth) : -modulo(-currentX, rowWidth);
    void startMarquee(fromX);
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-16"
      animate={controls}
      style={{ x }}
      onMouseEnter={() => controls.stop()}
      onMouseLeave={resumeMarquee}
    >
      {rowItems.map((project, index) => (
        <ProjectItem
          key={`${project.id}-${index}`}
          project={project}
          likeItemList={likeItemList}
          setLikeItemList={setLikeItemList}
          onSelect={onSelect}
          className="group w-[clamp(220px,25vw,360px)] flex-shrink-0 cursor-pointer pb-24"
        />
      ))}
    </motion.div>
  );
};

const ProjectSection = ({ projects }: { projects: ProjectType[] }) => {
  const { locale } = useLocale();
  const [likeItemList, setLikeItemList] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType>(null!);

  useEffect(() => {
    setLikeItemList(
      projects.map((project) => ({
        ...project,
        likesPerUser: getStoredLikes('project', project.id),
      })),
    );
  }, [projects]);

  return (
    <>
      <SectionWrapper
        title={locale === 'ja' ? '注目のプロジェクト' : 'Featured projects'}
        subtitle={
          locale === 'ja'
            ? '使う人にも、その裏側の仕組みにも丁寧に向き合ってつくった4つのプロダクトです。'
            : 'Four products built with care for both the people using them and the systems behind them.'
        }
      >
        <section className="relative flex flex-col gap-16 overflow-hidden py-4 md:gap-8 md:py-16">
          <MarqueeRow
            projects={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            onSelect={setSelectedProject}
          />
          <MarqueeRow
            projects={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            reverse
            onSelect={setSelectedProject}
          />
        </section>
      </SectionWrapper>
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

export default ProjectSection;
