'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import Titles from '@/app/components/interest-section/Titles';
import Descriptions from '@/app/components/interest-section/Descriptions';
import SectionWrapper from '@/components/SectionWrapper';
import styles from '@/app/components/interest-section/style.module.scss';
import { useLocale } from '@/components/LocaleContext';

// ----------------------
// Data Type
// ----------------------
export type DataType = { title: string; description: string; speed: number };

export const data: DataType[] = [
  {
    title: 'Interface Engineering',
    description:
      'Design systems, responsive UI, and accessible interaction patterns that make products feel calm and coherent.',
    speed: 0.5,
  },
  {
    title: 'Creative Code',
    description:
      'Playful experiments with motion, WebGL, and the browser—used deliberately to make digital experiences memorable.',
    speed: 0.5,
  },
  {
    title: 'Full-stack Systems',
    description:
      'APIs, databases, and automation that support reliable products from the interface down.',
    speed: 0.67,
  },
  {
    title: 'Product Storytelling',
    description:
      'Turning a rough idea into a clear user journey, useful prototype, and well-explained case study.',
    speed: 0.8,
  },
  {
    title: 'Developer Writing',
    description:
      'Notes on implementation, performance, and the small decisions behind a thoughtful interface.',
    speed: 0.8,
  },
];

// ----------------------
// Mobile Card
// ----------------------
type MobileCardProps = { project: DataType };

const MobileCard: React.FC<MobileCardProps> = ({ project }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b border-border">
      <button
        className="w-full flex items-center justify-between gap-4 p-4 bg-canvas font-bodyBold uppercase text-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="flex-1 truncate">{project.title}</span>
        <span className="shrink-0 text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="px-4 py-3 text-sm max-w-xl mx-auto"
        >
          {project.description}
        </m.div>
      )}
    </div>
  );
};

// ----------------------
// Desktop Card
// ----------------------
const DesktopCard: React.FC<{ data: DataType[] }> = ({ data }) => {
  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <Titles data={data} setSelectedProject={setSelectedInterest} />
      <Descriptions data={data} selectedProject={selectedInterest} />
    </div>
  );
};

// ----------------------
// Interest Section
// ----------------------
const InterestSection: React.FC = () => {
  const { locale } = useLocale();
  const localizedData: DataType[] = locale === 'ja' ? [
    { title: 'UIエンジニアリング', description: '落ち着きと一貫性を感じるプロダクトのための、デザインシステム、レスポンシブUI、アクセシブルな操作パターン。', speed: 0.5 },
    { title: 'クリエイティブコード', description: '忘れられないデジタル体験をつくるために、意図をもって使うモーション、WebGL、ブラウザの実験。', speed: 0.5 },
    { title: 'フルスタックシステム', description: 'UIから下の層まで、信頼できるプロダクトを支えるAPI、データベース、自動化。', speed: 0.67 },
    { title: 'プロダクトストーリーテリング', description: 'ラフなアイデアを、明快なユーザージャーニー、役立つプロトタイプ、伝わるケーススタディへ。', speed: 0.8 },
    { title: '開発者向けライティング', description: '実装、パフォーマンス、思慮深いUIをつくる小さな決断についての記録。', speed: 0.8 },
  ] : data;
  return (
    <SectionWrapper
      title={locale === 'ja' ? 'つくっているもの' : 'What I make'}
      subtitle={locale === 'ja' ? 'フロントエンドの仕組み、思慮深いプロダクトづくり、視覚的な実験。どれも好奇心と、使う人への敬意から生まれています。' : 'A mix of frontend systems, thoughtful product work, and visual experiments—each one shaped by curiosity and a respect for the people using it.'}
    >
      <div className={styles.main}>
        {/* Desktop layout */}
        <div className={`hidden md:block max-w-7xl ${styles.expertise}`}>
          <DesktopCard data={localizedData} />
        </div>

        {/* Mobile layout */}
        <div className="block md:hidden space-y-4 px-6 w-full">
          {localizedData.map((project, i) => (
            <MobileCard key={i} project={project} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InterestSection;
