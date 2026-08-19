'use client';

import DisperseText from '@/components/DisperseText';
import { PixelTrailBackground } from '@/components/PixelTrailBackground';
import SectionWrapper from '@/components/SectionWrapper';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { useLocale } from '@/components/LocaleContext';

const HeroScroller = () => {
  return (
    <div className="absolute bottom-12 left-0 w-full flex justify-center">
      <a href="#what-i-make">
        <div className="w-[35px] h-[64px] rounded-full border-4 border-border-subtle flex items-start p-2">
          <m.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
            className="w-3 h-3 bg-[var(--content)] rounded-[30%] mb-1"
          />
        </div>
      </a>
    </div>
  );
};

const HeroSection = () => {
  const { locale } = useLocale();
  return (
    <LazyMotion features={domAnimation}>
      <SectionWrapper className="max-w-screen w-full relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] px-4">
        <PixelTrailBackground color="random" />

        <div className="flex flex-col items-center z-10 space-y-4">
          <m.h1 className="text-4xl font-bodyBold font-flashy tracking-wide text-content sm:text-5xl sm:tracking-widest lg:text-7xl">
            <DisperseText bounce>{locale === 'ja' ? 'kiki です、よろしくね！' : "Hi, I’m Kiki!"}</DisperseText>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="mt-4 md:text-lg max-w-[45ch] sm:max-w-[65ch] lg:max-w-full"
          >
            {locale === 'ja'
              ? 'デザイン、コード、好奇心が交わる場所で、遊び心があり役に立つウェブ体験をつくっています。'
              : 'I build playful, useful web experiences where design, code, and curiosity meet.'}
          </m.p>
        </div>

        <HeroScroller />
      </SectionWrapper>
    </LazyMotion>
  );
};

export default HeroSection;
