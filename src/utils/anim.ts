// Defines the shape for a 2D transform object, including Z-axis rotation.
type TransformsType = {
  x: number;
  y: number;
  rotationZ: number;
};

// --- Utility: Seeded Random Number Generator (PRNG) ---

/**
 * A simple, seedable pseudo-random number generator for deterministic results.
 * @param s The seed value.
 * @returns A pseudo-random float between 0 (inclusive) and 1 (exclusive).
 */
const seededRandom = (s: number): number => {
  const x = Math.sin(s++) * 10000;
  return x - Math.floor(x);
};

// --- Transform Generator ---

const TWO_PI = Math.PI * 2;
const MAX_RADIUS_DECAY = 0.6;
const MIN_RADIUS = 0.2;
const MAX_ROTATION_Z = 40;

/**
 * Generates a list of deterministic 2D transforms (x, y, rotationZ)
 * that place items in a predictable, circular-ring pattern.
 *
 * @param count The number of transforms to generate.
 * @param seed The base seed for deterministic results (default: 42).
 * @returns An array of TransformsType objects.
 */
export function generateTransforms(count: number, seed = 42): TransformsType[] {
  const transforms: TransformsType[] = [];

  for (let i = 0; i < count; i++) {
    // Generate a predictable "random" number between 0 and 1 using the seed and index.
    const r = seededRandom(seed + i);

    // Calculate position in a circle (x, y)
    const angle = r * TWO_PI;
    const radius = MIN_RADIUS + r * MAX_RADIUS_DECAY; // Spread items from 0.2 to 0.8 radius.

    // Calculate item rotation (rotationZ)
    const rotationZ = Math.round((r - 0.5) * MAX_ROTATION_Z);

    transforms.push({
      // Calculate the x and y coordinates on the circle using trigonometry, clamped to 3 decimal places.
      x: +(Math.cos(angle) * radius).toFixed(3),
      y: +(Math.sin(angle) * radius).toFixed(3),
      rotationZ,
    });
  }

  return transforms;
}

// --- Framer Motion Variants for Text Dispersion ---

const DISPERSE_MAX_OFFSET_EM = 0.8;
const DISPERSE_MAX_ROTATION = 30;
const DISPERSE_TRANSITION = { duration: 0.75, ease: [0.33, 1, 0.68, 1] }; // Custom cubic-bezier easing.

/**
 * Defines animation variants for a text dispersion effect (likely for Framer Motion).
 * Each character animates between a compact 'closed' state and a scattered 'open' state.
 */
export const disperse = {
  /**
   * The "open" or "dispersed" state.
   * @param i The index of the character (for linear horizontal spread).
   * @param count The total number of characters.
   */
  open: (i: number, count: number) => {
    // Calculate linear horizontal dispersion based on index (spread from -maxOffset to +maxOffset).
    const x = (i / (count - 1) - 0.5) * DISPERSE_MAX_OFFSET_EM * 2;

    // Calculate random vertical offset and tilt for a scattered appearance.
    const y = (Math.random() - 0.5) * DISPERSE_MAX_OFFSET_EM * 2;
    const rotateZ = (Math.random() - 0.5) * DISPERSE_MAX_ROTATION;

    return {
      x: x + 'em',
      y: y + 'em',
      rotateZ,
      transition: DISPERSE_TRANSITION,
      zIndex: 1,
    };
  },

  /**
   * The "closed" or "default" state where characters are in their normal, compact position.
   */
  closed: {
    x: '0em',
    y: '0em',
    rotateZ: 0,
    transition: DISPERSE_TRANSITION,
    zIndex: 0,
  },
};
