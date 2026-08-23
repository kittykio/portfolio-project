'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

/** Uses GSAP's cached setters for high-frequency pointer movement. */
export const Magnetic = ({ children }: { children: ReactNode }) => {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = magnetic.current;
    if (!el) return;

    // quickTo reuses a tween instead of allocating one on every mouse event.
    const xTo = gsap.quickTo(el, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
    const yTo = gsap.quickTo(el, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      // Keep the element close enough to its hit area that it remains easy to click.
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={magnetic}>{children}</div>;
};

/** Declarative magnetic variant for elements already rendered by Framer Motion. */
export const FramerMagnetic = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    // This variant is used on small controls, so it can travel farther than the GSAP wrapper.
    setPosition({
      x: (clientX - (left + width / 2)) * 0.75,
      y: (clientY - (top + height / 2)) * 0.75,
    });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};
