import React, { useRef } from 'react';
import { useScroll, motion, useTransform, useMotionTemplate } from 'framer-motion';
import styles from '@/app/components/interest-section/style.module.scss';
import { DataType } from '@/app/components/interest-section/InterestSection';

type TitlesProps = {
  data: DataType[];
  setSelectedProject: (index: number | null) => void;
};

const Titles: React.FC<TitlesProps> = ({ data, setSelectedProject }) => {
  return (
    <div className={styles.titles}>
      {data.map((project, i) => (
        <Title key={i} data={project} index={i} setSelectedProject={setSelectedProject} />
      ))}
    </div>
  );
};

type TitleProps = {
  data: DataType;
  index: number;
  setSelectedProject: (index: number | null) => void;
};

const Title: React.FC<TitleProps> = ({ data, index, setSelectedProject }) => {
  const { title, speed } = data;
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', `${25 / speed}vw end`],
  });

  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;

  return (
    <div ref={container} className={`${styles.title} relative`}>
      <div
        className={styles.wrapper}
        onMouseOver={() => setSelectedProject(index)}
        onMouseLeave={() => setSelectedProject(null)}
      >
        <motion.p style={{ clipPath: clip }}>{title}</motion.p>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Titles;
