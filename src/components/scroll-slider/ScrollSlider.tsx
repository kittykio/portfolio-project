'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ConfettiParticles } from '@/components/scroll-slider/ConfettiParticles';

// Defines the props for the ScrollSlider component.
type ScrollSliderProps = {
  // The content that the scroll slider wraps and monitors.
  children: ReactNode;
};

// A component that displays a progress bar showing scroll completion and triggers confetti at the end.
const ScrollSlider = ({ children }: ScrollSliderProps) => {
  // State to hold the current scroll percentage of the document (0 to 100).
  const [scrolled, setScrolled] = useState(0);

  // Sets up and cleans up the scroll event listener.
  useEffect(() => {
    // Calculates the scroll percentage.
    const handleScroll = () => {
      // Gets the vertical scroll position.
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      // Calculates the total scrollable height of the document.
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      // Calculates the scroll percentage.
      let percent = (winScroll / height) * 100;
      // Clamps the percentage to a maximum of 100%.
      if (percent > 100) percent = 100;
      setScrolled(percent);
    };

    // Adds the scroll event listener when the component mounts.
    window.addEventListener('scroll', handleScroll);
    // Removes the event listener when the component unmounts.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Container for the fixed progress bar. */}
      <div className="flex justify-center">
        <div
          // Progress bar base styling: fixed at the top, half-width, and accessible attributes.
          className="w-[50%] h-4 mt-[80px] fixed top-0 z-20 bg-surface-muted rounded-full overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuenow={scrolled}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* The colored progress indicator bar. */}
          <div
            className="h-full bg-flame-500 transition-all duration-100 ease-out"
            // Dynamically sets the width based on the current scroll percentage.
            style={{ width: `${scrolled}%` }}
          ></div>
        </div>
      </div>
      {/* Renders the child content wrapped by the slider. */}
      {children}
      {/* Triggers the confetti effect when the page is scrolled near the bottom (90% or more). */}
      {scrolled >= 90 ? <ConfettiParticles /> : null}
    </>
  );
};

export default ScrollSlider;
