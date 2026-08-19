'use client';

import { FC, MutableRefObject, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/motion';
import { RiCloseCircleFill } from 'react-icons/ri';

// Defines the properties for the FilterWrapper component.
type FilterWrapperProps = {
  // The content to be wrapped, typically the individual filter components.
  children: ReactNode;
  // A callback function to reset all applied filters.
  onClearAll: () => void;
  // A flag to determine whether the "Clear All" button should be displayed.
  showClear: boolean;
  // A mutable ref object pointing to the background overlay div for external manipulation (e.g., controlling opacity).
  background: MutableRefObject<HTMLDivElement>;
};

// A wrapper component for a collection of filters, providing layout, animation, and a clear button.
const FilterWrapper: FC<FilterWrapperProps> = ({
  children,
  onClearAll,
  showClear = true,
  background,
}) => {
  return (
    <>
      {/* Main section for the filters, animated with Framer Motion. */}
      <motion.section
        // Applies a staggered animation container variant for its children.
        variants={staggerContainer(0.5, 0.3)}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-4 relative w-full"
      >
        {/* The "Clear All" button, conditionally rendered and animated. */}
        {onClearAll && showClear && (
          <motion.button
            // Applies a slight scale effect on hover.
            whileHover={{ scale: 1.05 }}
            // Applies a slight scale down effect on tap/click.
            whileTap={{ scale: 0.95 }}
            onClick={onClearAll}
            className="hover:text-flame-500 transition flex items-center self-end gap-1"
          >
            <RiCloseCircleFill size={24} />
            <span>Clear All</span>
          </motion.button>
        )}

        {/* Renders the individual filter components passed as children. */}
        {children}
      </motion.section>

      {/* Background overlay div, typically used for dimming the content behind the filters or for transition effects. */}
      <div
        // Attaches the external ref for manipulation by parent components.
        ref={background}
        // Initial state is invisible and non-interactive.
        className="pointer-events-none absolute inset-0 z-10 h-full w-full max-w-full bg-canvas opacity-0"
      />
    </>
  );
};

export default FilterWrapper;
