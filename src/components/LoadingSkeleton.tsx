'use client';

import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';

const LoadingSkeleton = () => {
  return (
    <motion.main
      variants={staggerContainer(0.5, 0.5)}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full h-full overflow-hidden px-4 mb-[400px]"
    >
      {/* Header shimmer */}
      <motion.div
        variants={fadeIn('down', 'spring', 0, 0.5)}
        className="w-52 h-16 bg-surface-subtle rounded-lg animate-pulse mb-24"
      />

      {/* Grid of loading cards */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.1, 0.8)}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl w-full"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center space-y-3 bg-surface-muted rounded-2xl overflow-hidden shadow-md p-3 animate-pulse"
          >
            <div className="w-full aspect-square bg-surface-subtle rounded-lg" />
            <div className="h-4 w-3/4 bg-surface-subtle rounded-md" />
          </div>
        ))}
      </motion.div>

      {/* Optional footer shimmer */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.3, 0.5)}
        className="w-64 h-6 bg-surface-subtle rounded-lg mt-12 animate-pulse"
      />
    </motion.main>
  );
};

export default LoadingSkeleton;
