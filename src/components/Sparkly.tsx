'use client';

import React, { FC, useMemo, useState, useRef, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';

// --- Utility Functions ---

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 */
const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min;

/**
 * Creates an array of numbers from 0 up to (but not including) count.
 */
const range = (count: number): number[] => Array.from({ length: count }, (_, i) => i);

// --- Hooks ---

/**
 * Executes a callback at a random interval between minDelay and maxDelay.
 * Uses window.setTimeout for proper server-side rendering compatibility (via window).
 */
const useRandomInterval = (
  callback: () => void,
  minDelay: number | null,
  maxDelay: number | null,
) => {
  // Store timeout ID to clear it on unmount or dependency change.
  const timeoutId = useRef<number>();
  // Store the latest callback reference.
  const savedCallback = useRef(callback);

  useMemo(() => {
    savedCallback.current = callback;
  }, [callback]);

  useMemo(() => {
    // Only proceed if both delays are valid numbers.
    if (typeof minDelay !== 'number' || typeof maxDelay !== 'number') return;

    const handleTick = () => {
      // Calculate the next random delay.
      const nextTickAt = random(minDelay, maxDelay);
      timeoutId.current = window.setTimeout(() => {
        savedCallback.current();
        handleTick(); // Schedule the next tick.
      }, nextTickAt);
    };

    handleTick(); // Start the interval loop immediately.
    return () => window.clearTimeout(timeoutId.current); // Cleanup on unmount.
  }, [minDelay, maxDelay]);
};

// Media query to check user preference for motion reduction.
const QUERY = '(prefers-reduced-motion: no-preference)';

/**
 * Hook to detect if the user prefers reduced motion, which should disable animations.
 */
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useMemo(() => {
    // Ensure this runs only in the browser environment.
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(QUERY);
    // Listener sets state to true if event.matches is false (meaning no-preference is NOT matched).
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(!event.matches);

    // Initial check.
    setPrefersReducedMotion(!mediaQueryList.matches);

    // Listen for changes.
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};

// --- Sparkle Configuration ---

const DEFAULT_COLOR = 'var(--lemon)';
const MAX_SPARKLE_AGE_MS = 750;

type SparkleType = {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: { top: string; left: string };
};

/**
 * Factory function to create a new sparkle object with random properties.
 */
const generateSparkle = (color: string): SparkleType => ({
  id: String(random(10000, 99999)),
  createdAt: Date.now(),
  color,
  size: random(10, 25),
  style: {
    // Random position within the parent's boundaries (0-75% top, 0-100% left).
    top: `${random(0, 75)}%`,
    left: `${random(0, 100)}%`,
  },
});

/**
 * A simple SVG component for the 4-pointed sparkle shape.
 */
const SparkleSVG: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M50 0C50 0 52.7588 25.7497 63.5045 36.4955C74.2503 47.2412 100 50 100 50C100 50 74.2503 52.7588 63.5045 63.5045C52.7588 74.2503 50 100 50 100C50 100 47.2412 74.2503 36.4955 63.5045C25.7497 52.7588 0 50 0 50C0 50 25.7497 47.2412 36.4955 36.4955C47.2412 25.7497 50 0 50 0Z"
      fill={color}
    />
  </svg>
);

// --- Main Component ---

const Sparkly = ({ color = DEFAULT_COLOR, children }: { color?: string; children: ReactNode }) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  // State to track if the component has mounted on the client.
  const [isMounted, setIsMounted] = useState(false);

  // Initialize initial set of sparkles and set mounted state on client.
  useMemo(() => {
    // Initialize a small set of base sparkles.
    setSparkles(range(3).map(() => generateSparkle(color)));
    // Set isMounted flag after the initial render.
    setIsMounted(true);
  }, [color]);

  // Callback to generate new sparkles and clean up old ones.
  const generateAndCleanupSparkles = useCallback(() => {
    const sparkle = generateSparkle(color);
    const now = Date.now();

    // Filter out old sparkles (older than MAX_SPARKLE_AGE_MS) and add the new one.
    const nextSparkles = sparkles.filter((sp) => now - sp.createdAt < MAX_SPARKLE_AGE_MS);
    nextSparkles.push(sparkle);

    setSparkles(nextSparkles);
  }, [color, sparkles]);

  // Start the random interval loop, respecting the user's reduced motion preference.
  useRandomInterval(
    generateAndCleanupSparkles,
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 450,
  );

  // Render children without sparkles during SSR or before mounting.
  if (!isMounted) {
    // Use the inner element structure to maintain consistent styling for SSR.
    return (
      <strong className="relative z-10 font-bodyBold tracking-wider text-lg">{children}</strong>
    );
  }

  return (
    <span className="relative inline-block">
      {/* Sparkle animation elements */}
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute block"
          style={sparkle.style}
          initial={{ scale: 0, rotate: 0, opacity: 1 }}
          // Animate: scale up (1), hold (1), scale down (0) | rotate 180 degrees | opacity fade out (1, 1, 0).
          animate={{ scale: [0, 1, 0], rotate: 180, opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <SparkleSVG size={sparkle.size} color={sparkle.color} />
        </motion.span>
      ))}

      {/* Wrapped content (must be z-indexed above the sparkles) */}
      <strong className="relative z-10 font-bodyBold tracking-wider text-lg">{children}</strong>
    </span>
  );
};

export default Sparkly;
