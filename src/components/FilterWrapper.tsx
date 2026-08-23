'use client';

import { FC, MutableRefObject, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/motion';
import { RiCloseCircleFill } from 'react-icons/ri';

type FilterWrapperProps = {
  children: ReactNode;
  onClearAll: () => void;
  showClear: boolean;
  /** Overlay controlled by the parent transition timeline. */
  background: MutableRefObject<HTMLDivElement>;
};

const FilterWrapper: FC<FilterWrapperProps> = ({
  children,
  onClearAll,
  showClear = true,
  background,
}) => {
  return (
    <>
      <motion.section
        variants={staggerContainer(0.5, 0.3)}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-4 relative w-full"
      >
        {onClearAll && showClear && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearAll}
            className="hover:text-flame-500 transition flex items-center self-end gap-1"
          >
            <RiCloseCircleFill size={24} />
            <span>Clear All</span>
          </motion.button>
        )}

        {children}
      </motion.section>

      <div
        ref={background}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full max-w-full bg-canvas opacity-0"
      />
    </>
  );
};

export default FilterWrapper;
