'use client';

import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { PostType } from '@/types/PostType';
import SectionWrapper from '@/components/SectionWrapper';
import PostItem from '../../components/PostItem';
import { getStoredLikes } from '@/utils/likes';
import { useLocale } from '@/components/LocaleContext';

type ColumnProps = {
  posts: PostType[];
  reverse?: boolean;
  duration: number;
  colKey: string;
  extraClasses?: string;
  postItemList: PostType[];
  setPostItemList: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const Column = ({
  posts,
  reverse = false,
  duration,
  colKey,
  extraClasses = '',
  postItemList,
  setPostItemList,
}: ColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const [height, setHeight] = useState(0);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight / 2);
    }
  }, [posts]);

  const startMarquee = async (fromY = 0) => {
    if (!height || height <= 0) return;

    const target = reverse ? 0 : -height;
    y.set(fromY);

    await controls.start({
      y: [fromY, target],
      transition: {
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration,
      },
    });
  };

  useEffect(() => {
    if (height > 0) {
      void startMarquee(reverse ? -height : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, reverse]);

  const handlePause = () => controls.stop();

  const handleResume = () => {
    if (!height || height <= 0) {
      void startMarquee(0);
      return;
    }

    const currentY = y.get();
    let fromY: number;

    if (!reverse) {
      const p = mod(-currentY, height);
      fromY = -p;
    } else {
      const p = mod(currentY, height);
      fromY = -height + p;
    }

    void startMarquee(fromY);
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col gap-16 ${extraClasses}`}
      animate={controls}
      style={{ y }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {posts.map((post, i) => (
        <PostItem
          key={`${colKey}-${i}`}
          index={i}
          post={post}
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
      ))}
    </motion.div>
  );
};

const BlogSection = ({ posts }: { posts: PostType[] }) => {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState<boolean>(false);
  const [postItemList, setPostItemList] = useState<PostType[]>([]);

  useEffect(() => {
    const enriched: PostType[] = posts.map((post) => ({
      ...post,
      likesPerUser: getStoredLikes('blog', post.id),
    }));
    setPostItemList(enriched);
    setMounted(true);
  }, [posts]);

  const makeItems = (slice: PostType[], reverse = false): PostType[] =>
    reverse ? [...slice.slice().reverse(), ...slice.slice().reverse()] : [...slice, ...slice];

  // Distribute posts evenly so the homepage always has three deliberate columns.
  const columnItems1 = makeItems(postItemList.filter((_, index) => index % 3 === 0));
  const columnItems2 = makeItems(postItemList.filter((_, index) => index % 3 === 1), true);
  const columnItems3 = makeItems(postItemList.filter((_, index) => index % 3 === 2));

  if (!mounted || posts.length === 0) return null;

  return (
    <SectionWrapper
      title={locale === 'ja' ? 'ブログ' : 'Blog'}
      subtitle={locale === 'ja' ? '好奇心から生まれ、情熱に育まれ、新しい視点を求め続けるなかで進んでいく、考えごと、気づき、変化し続ける実験の記録です。' : 'Endless currents of thought, meandering reflections, and evolving experiments, born from curiosity, nurtured by passion, and propelled forward by the inexhaustible stream of wonder, inspiration, and the relentless pursuit of new perspectives.'}
    >
      <section className="relative mx-auto flex w-full max-w-7xl flex-row justify-center gap-8 overflow-hidden px-4 py-4 sm:px-8 md:gap-12 max-h-[60vh]">
        <Column
          posts={columnItems1}
          duration={20}
          colKey="col1"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
          extraClasses="w-full max-w-sm"
        />
        <Column
          posts={columnItems2}
          reverse
          duration={25}
          colKey="col2"
          extraClasses="hidden md:flex w-full max-w-sm"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
        <Column
          posts={columnItems3}
          duration={30}
          colKey="col3"
          extraClasses="hidden md:flex w-full max-w-sm"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
      </section>
    </SectionWrapper>
  );
};

export default BlogSection;
