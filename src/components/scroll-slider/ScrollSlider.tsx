'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ConfettiParticles } from '@/components/scroll-slider/ConfettiParticles';

type ScrollSliderProps = {
  children: ReactNode;
};

/** Reports document progress and celebrates only after the reader reaches the final 10%. */
const ScrollSlider = ({ children }: ScrollSliderProps) => {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // body.scrollTop supports older browser/document modes; standards mode uses documentElement.
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let percent = (winScroll / height) * 100;
      if (percent > 100) percent = 100;
      setScrolled(percent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div
          className="w-[50%] h-4 mt-[80px] fixed top-0 z-20 bg-surface-muted rounded-full overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuenow={scrolled}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-flame-500 transition-all duration-100 ease-out"
            style={{ width: `${scrolled}%` }}
          ></div>
        </div>
      </div>
      {children}
      {scrolled >= 90 ? <ConfettiParticles /> : null}
    </>
  );
};

export default ScrollSlider;
