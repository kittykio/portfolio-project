'use client';

import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const LoadingSpinner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState('');

  // Animate "Loading..." dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Motion values for gradient position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth motion
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  // Mouse and touch handler
  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(clientX - rect.left);
    y.set(clientY - rect.top);
  };

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', touchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('touchmove', touchMove);
    };
  }, []);

  // CSS gradient
  const background = useMotionTemplate`
    radial-gradient(400px circle at ${springX}px ${springY}px, var(--glow-flame), transparent 70%)
  `;

  return (
    <div
      ref={containerRef}
      className="relative isolate flex h-full w-full flex-col items-center justify-center overflow-hidden px-4 mb-[400px] min-h-[calc(100vh-64px)]"
    >
      {/* Gradient background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-flame-300 blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          rotate: [0, 90, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-lemon blur-2xl"
        animate={{
          x: [0, -20, 40, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Core spinner */}
      <motion.div
        className="relative w-32 h-32 mb-16"
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-8 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-t-8 border-flame-500 rounded-full" />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="text-4xl font-heading text-gray-700 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        LOADING{dots}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
