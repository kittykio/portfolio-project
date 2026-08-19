'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

// Component that applies a "magnetic" hover effect using GSAP.
export const Magnetic = ({ children }: { children: ReactNode }) => {
  // Ref to attach to the element that should become magnetic.
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture the ref in a local variable for use in event listeners and cleanup.
    const el = magnetic.current;
    if (!el) return;

    // GSAP quickTo functions for optimizing performance of a single property animation.
    // They allow quickly setting up a target value with specified duration and easing.
    const xTo = gsap.quickTo(el, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
    const yTo = gsap.quickTo(el, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    // Calculates the offset of the mouse from the center of the element and applies the translation.
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      // Calculate the difference from the center point.
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      // Apply translation, scaled down by 0.35 to dampen the effect.
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    // Resets the element's position back to (0, 0) when the mouse leaves.
    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    // Attach event listeners.
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to remove event listeners when the component unmounts.
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={magnetic}>{children}</div>;
};

// Component that applies a "magnetic" hover effect using Framer Motion.
export const FramerMagnetic = ({ children }: { children: ReactNode }) => {
  // Ref for the element being animated.
  const ref = useRef<HTMLDivElement>(null);
  // State to hold the current animation target position {x, y}.
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculates the offset and updates the state, which triggers the Framer Motion animation.
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    // Calculate and set the new target position, scaled down by 0.35.
    setPosition({
      x: (clientX - (left + width / 2)) * 0.75,
      y: (clientY - (top + height / 2)) * 0.75,
    });
  };

  // Resets the target position to (0, 0) when the mouse leaves.
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      // Animates the element to the current 'position' state {x, y}.
      animate={position}
      // Uses a spring transition for a natural, bouncy feel.
      transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};
