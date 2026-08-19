import { FC } from 'react';
import { motion } from 'framer-motion';
import { zoomIn } from '@/utils/motion';

// --- FilterTag Components and Types ---

type FilterTagProps = {
  // Index for staggered animation delay.
  i: number;
  // The tag string value.
  tag: string;
  // Handler for when the tag is clicked.
  handleOnChange: (tag: string) => void;
  // Flag to indicate if the tag is currently selected/active.
  active: boolean;
  // Function to set a reference state (likely for a magnetic/hover effect outside the component).
  setRef: (active: boolean) => void;
};

/**
 * An interactive, animated tag used for filtering content.
 * It uses Framer Motion for staggered entry and includes hover callbacks.
 */
export const FilterTag: FC<FilterTagProps> = ({ i, tag, handleOnChange, active, setRef }) => {
  const baseClasses =
    'hover:z-20 text-sm px-3 py-1 rounded-full border transition whitespace-nowrap';

  // Style based on active state.
  const activeClasses =
    'bg-lemon text-gray-900 border border-lemon dark:bg-gray-900 dark:text-lemon dark:border-lemon';
  const inactiveClasses =
    'bg-surface-muted text-content border-border-subtle dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700';

  return (
    <motion.button
      // Staggered zoom-in animation based on index `i`.
      variants={zoomIn(i * 0.05, 0.5)}
      key={tag}
      onClick={() => handleOnChange(tag)}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      onMouseEnter={() => setRef(true)}
      onMouseLeave={() => setRef(false)}
    >
      #{tag}
    </motion.button>
  );
};

// --- DisplayTag Component and Types ---

type DisplayTagProps = {
  // The tag string value.
  tag: string;
};

/**
 * A non-interactive, visual tag component used to display applied tags/categories.
 */
export const DisplayTag: FC<DisplayTagProps> = ({ tag }) => (
  <span className="cursor-default text-sm bg-lemon dark:bg-gray-900 text-gray-800 dark:text-lemon border border-lemon px-3 py-1 rounded-full w-fit whitespace-nowrap">
    #{tag}
  </span>
);
