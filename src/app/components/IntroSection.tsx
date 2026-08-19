'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/SectionWrapper';
import { useLocale } from '@/components/LocaleContext';

const IntroSection = () => {
  const { locale } = useLocale();
  const para = locale === 'ja'
    ? 'Kikiは、ブラウザを実用的な道具であると同時に創造のキャンバスとして扱うフルスタック開発者です。最初のアイデアから最後のインタラクションまで、役に立つプロダクトを丁寧にかたちにすることを楽しんでいます。明快な仕組み、表現豊かなUI、思慮深いモーション、そして使う人に寄り添う小さなディテールを大切にしています。複雑なことを落ち着いて使える体験に変え、好奇心を持って試し、何度も磨きながら、長く愛されるデジタルの居場所をつくります。'
    : 'I’m Kiki, a full-stack developer who sees the browser as both a practical tool and a creative canvas. I enjoy shaping useful products from the first idea to the final interaction—bringing together clear systems, expressive interfaces, thoughtful motion, and the small details that make software feel human. I like turning complexity into calm, usable experiences: exploring with curiosity, refining with care, and building digital spaces that feel considered long after the first visit.';
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    gsap.to(lettersRef.current, {
      opacity: 1,
      ease: 'power1.out',
      stagger: 0.01,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'bottom 30%',
        scrub: true,
      },
    });
  }, [para]);

  const addRef = (el: HTMLSpanElement | null) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  const splitLetters = (text: string) =>
    text.split('').map((char, i) => (
      <span key={`${char}_${i}`} ref={addRef} className="opacity-20">
        {char}
      </span>
    ));

  const firstLetter = para[0];
  const rest = para.slice(1);

  return (
    <SectionWrapper className="w-full max-w-screen flex justify-center my-24 py-24 md:my-48 md:py-48 text-gray-500 text-lg md:text-3xl leading-[1.5] font-bodyBold px-4">
      <div ref={containerRef} className="max-w-3xl">
        <p className="relative">
          <span className="float-left text-7xl md:text-9xl leading-[1.5] mr-8 font-heading text-content font-bodyBold">
            {firstLetter}
          </span>
          {splitLetters(rest)}
        </p>
      </div>
    </SectionWrapper>
  );
};

export default IntroSection;
