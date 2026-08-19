import { Variants, Transition } from 'framer-motion';

// --- Types & Constants ---

// Type-safe direction options for movement animations.
type Direction = 'left' | 'right' | 'up' | 'down' | 'none';

// Default transition settings for reusable animations.
const DEFAULT_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.6,
  ease: 'easeOut',
};

// --- Helper Function ---

/**
 * Calculates the X and Y offset based on a direction and distance.
 * @param direction The direction of movement.
 * @param distance The pixel distance for the offset (default is 100px).
 * @returns An object with x and y coordinates.
 */
const getOffset = (direction: Direction, distance: number = 100) => {
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 }; // Moves from left (negative X) to center (0)
    case 'right':
      return { x: distance, y: 0 }; // Moves from right (positive X) to center (0)
    case 'up':
      return { x: 0, y: distance }; // Moves from up (positive Y) to center (0)
    case 'down':
      return { x: 0, y: -distance }; // Moves from down (negative Y) to center (0)
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Calculates the percentage offset for full-screen slide-in animations.
 * @param direction The direction of movement.
 * @returns An object with x and y percentage transforms.
 */
const getPercentageOffset = (direction: Direction) => {
  switch (direction) {
    case 'left':
      return { x: '-100%', y: 0 };
    case 'right':
      return { x: '100%', y: 0 };
    case 'up':
      return { x: 0, y: '100%' };
    case 'down':
      return { x: 0, y: '-100%' };
    default:
      return { x: 0, y: 0 };
  }
};

// --- Variants ---

/**
 * Simple text variant that slides in from the top with a spring effect.
 * @param delay Time delay before the animation starts (in seconds).
 * @returns Framer Motion Variants.
 */
export const textVariant = (delay: number = 0): Variants => ({
  hidden: { y: -50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 1.25,
      delay,
    },
  },
});

/**
 * Fade in from a direction (pixel-based offset), typically for elements near the center.
 * @param direction Direction to slide from (e.g., 'left', 'up').
 * @param type Transition type ('spring' or 'tween').
 * @param delay Time delay before the animation starts.
 * @param duration Duration of the animation.
 * @returns Framer Motion Variants.
 */
export const fadeIn = (
  direction: Direction = 'none',
  type: 'spring' | 'tween' = 'tween',
  delay: number = 0,
  duration: number = DEFAULT_TRANSITION.duration as number,
): Variants => {
  const offset = getOffset(direction);

  return {
    hidden: { ...offset, opacity: 0 },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type, delay, duration, ease: 'easeOut' },
    },
  };
};

/**
 * Zoom in effect (scale and opacity).
 * @param delay Time delay before the animation starts.
 * @param duration Duration of the animation.
 * @returns Framer Motion Variants.
 */
export const zoomIn = (
  delay: number = 0,
  duration: number = DEFAULT_TRANSITION.duration as number,
): Variants => ({
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'tween', delay, duration, ease: 'easeOut' },
  },
});

/**
 * Slide in from a direction (percentage-based), ideal for full-screen sections or large panels.
 * @param direction Direction to slide from.
 * @param type Transition type ('spring' or 'tween').
 * @param delay Time delay before the animation starts.
 * @param duration Duration of the animation.
 * @returns Framer Motion Variants.
 */
export const slideIn = (
  direction: Direction = 'none',
  type: 'spring' | 'tween' = 'tween',
  delay: number = 0,
  duration: number = DEFAULT_TRANSITION.duration as number,
): Variants => {
  const hidden = getPercentageOffset(direction);

  return {
    hidden,
    show: {
      x: 0,
      y: 0,
      transition: { type, delay, duration, ease: 'easeOut' },
    },
  };
};

/**
 * Defines a container for staggered child animations.
 * @param staggerChildren Delay between the start of each child animation.
 * @param delayChildren Delay before the first child animation starts.
 * @returns Framer Motion Variants.
 */
export const staggerContainer = (
  staggerChildren: number = 0.2,
  delayChildren: number = 0,
): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});
