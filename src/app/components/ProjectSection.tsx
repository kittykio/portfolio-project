'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import { ProjectType } from '@/types/ProjectType';
import ProjectModal from '@/app/projects/components/ProjectModal';
import ProjectItem from '../../components/ProjectItem';
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

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setRowWidth(el.scrollWidth / 2 || 0);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const rowItems = reverse
    ? [...projects.slice().reverse(), ...projects.slice().reverse()]
    : [...projects, ...projects];

  const startMarquee = async (fromX = 0) => {
    if (!rowWidth || rowWidth <= 0) return;
    x.set(fromX);

    await controls.start({
      x: [fromX, reverse ? 0 : -rowWidth],
      transition: {
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration: 100,
      },
    });
  };

  useEffect(() => {
    if (rowWidth > 0) void startMarquee(reverse ? -rowWidth : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowWidth, reverse]);

  const handlePause = () => controls.stop();
  const handleResume = () => {
    if (!rowWidth || rowWidth <= 0) {
      void startMarquee(0);
      return;
    }
    const currentX = x.get();
    const fromX = !reverse ? -mod(-currentX, rowWidth) : -rowWidth + mod(currentX, rowWidth);
    void startMarquee(fromX);
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-16"
      animate={controls}
      style={{ x }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {rowItems.map((project, i) => (
        <ProjectItem
          key={i}
          project={project}
          likeItemList={likeItemList}
          setLikeItemList={setLikeItemList}
          onSelect={onSelect}
          className="flex-shrink-0 w-[clamp(220px,25vw,360px)] cursor-pointer group pb-24"
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
        subtitle={locale === 'ja' ? '使う人にも、その裏側の仕組みにも丁寧に向き合ってつくったプロダクト、UI、創作的な実験の一部です。' : 'A selection of products, interfaces, and creative experiments—built with care for both the people using them and the systems behind them.'}
      >
        <section className="relative overflow-hidden py-4 md:py-16 flex flex-col gap-16 md:gap-8">
          <MarqueeRow
            projects={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            reverse={false}
            onSelect={setSelectedProject}
          />
          <MarqueeRow
            projects={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            reverse={true}
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
