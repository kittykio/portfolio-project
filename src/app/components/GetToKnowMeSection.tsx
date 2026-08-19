'use client';

import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { fadeIn, staggerContainer } from '@/utils/motion';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/components/LocaleContext';

type CardType = { front: string; back: string[] | ReactNode };

const cards: CardType[] = [
  {
    front: 'Facts',
    back: ['Dreamer', 'INTJ', 'Pisces', 'Go-getter', 'Organized', 'Minimalist'],
  },
  { front: 'Languages', back: ['Burmese', 'English', 'Japanese'] },
  {
    front: 'Favourite tools',
    back: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Git'],
  },
  {
    front: 'Working style',
    back: ['Curious', 'Organized', 'Collaborative', 'Detail-oriented', 'Iterative'],
  },
  {
    front: 'Favorites',
    back: ['Coffee', 'Chocolate', 'Noodles', 'Cats', 'Nuts', 'Sushi'],
  },
  {
    front: 'Currently exploring',
    back: ['Creative coding', 'Accessible motion', 'Design systems', '3D on the web'],
  },
  {
    front: 'Strengths',
    back: ['Frontend architecture', 'Product UI', 'Prototyping', 'Technical writing'],
  },
  {
    front: 'Motto',
    back: [
      'Create Daily',
      'Stay Curious',
      'Less is More',
      'Make your own rules',
      'Today is the youngest you will ever be',
    ],
  },
  {
    front: 'Developer skills',
    back: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Django', 'Figma'],
  },
];

const japaneseCards: CardType[] = [
  { front: 'プロフィール', back: ['夢想家', 'INTJ', 'うお座', '行動派', '整理好き', 'ミニマリスト'] },
  { front: '話せる言語', back: ['ビルマ語', '英語', '日本語'] },
  { front: '好きなツール', back: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Git'] },
  { front: '働き方', back: ['好奇心旺盛', '整理好き', '協調的', '細部を大切にする', '反復して磨く'] },
  { front: '好きなもの', back: ['コーヒー', 'チョコレート', '麺', '猫', 'ナッツ', '寿司'] },
  { front: 'いま探っていること', back: ['クリエイティブコーディング', 'アクセシブルなモーション', 'デザインシステム', 'ウェブの3D'] },
  { front: '強み', back: ['フロントエンド設計', 'プロダクトUI', 'プロトタイピング', '技術ライティング'] },
  { front: 'モットー', back: ['毎日つくる', '好奇心を持ち続ける', '少ないほど豊か', '自分のルールをつくる', '今日がいちばん若い日'] },
  { front: '開発スキル', back: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Django', 'Figma'] },
];

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
};

const FlipCard = ({
  front,
  back,
  size,
}: {
  front: string;
  back: string[] | ReactNode;
  size: CSSProperties;
}) => {
  const [index, setIndex] = useState(0);
  const isArray = Array.isArray(back);

  useEffect(() => {
    if (!isArray) return;
    const interval = setInterval(() => setIndex((i) => i + 1), 1500);
    return () => clearInterval(interval);
  }, [isArray]);

  return (
    <div className="relative w-full h-full [perspective:1200px] group" style={size}>
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] text-content">
        {/* Front side */}
        <Card rounded>{front}</Card>

        {/* Back side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-flame-500 text-gray-100 p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg">
          {isArray ? <AnimatedText text={back[index % back.length]} /> : <>{back}</>}
        </div>
      </div>
    </div>
  );
};

const GetToKnowMeSection = () => {
  const { locale } = useLocale();
  const cardSize = { width: 180, height: 180 };
  const localizedCards = locale === 'ja' ? japaneseCards : cards;

  return (
    <SectionWrapper
      title={locale === 'ja' ? 'Kikiについて' : 'Get to know me'}
      subtitle={locale === 'ja' ? 'アイデア、スケッチ、ちょっとした癖、ふとした考えが混ざり合う、カラフルで少し散らかった世界。実験、ひらめき、失敗、小さな喜びがぶつかり合う創作の舞台裏をのぞいてみてください。' : 'A messy, colorful mix of ideas, sketches, quirks, and fleeting thoughts—come peek behind the scenes of my creative chaos, where experiments, inspirations, mistakes, and little joys collide, revealing the hidden layers, playful impulses, and untamed energy that shape who I am and how I create.'}
    >
      <motion.section
        variants={staggerContainer(0.5, 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-8 overflow-hidden p-4 sm:gap-12 sm:p-8 md:gap-16"
      >
        {/* Grid of cards */}
        {localizedCards.map((c, i) => (
          // Outer motion handles the entrance variant
          <motion.div
            key={i}
            variants={fadeIn('right', 'spring', i * 0.12, 0.85)}
            className="group"
          >
            {/* Inner motion handles the floating loop and in-view detection */}
            <CardFloatWrapper index={i}>
              <FlipCard front={c.front} back={c.back} size={cardSize} />
            </CardFloatWrapper>
          </motion.div>
        ))}
      </motion.section>
    </SectionWrapper>
  );
};

export default GetToKnowMeSection;
