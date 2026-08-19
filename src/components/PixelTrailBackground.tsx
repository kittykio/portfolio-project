'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { colorPalette } from '@/constants/colorPalette';

type ColorKey = 'var(--flame-500)' | 'var(--lemon)' | 'random';

type Props = {
  color?: ColorKey;
};

// Define a list of colors to use for the 'random' option
const COLOR_PALETTE = [
  colorPalette.flame300,
  colorPalette.flame500,
  colorPalette.lemon,
  colorPalette.rainbowRed,
  colorPalette.rainbowOrange,
  colorPalette.rainbowYellow,
  colorPalette.rainbowGreen,
  colorPalette.rainbowBlue,
  colorPalette.rainbowViolet,
];

export const PixelTrailBackground = ({ color = 'var(--flame-500)' }: Props) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to get a random color from the palette
  const getRandomColor = useCallback(() => {
    const index = Math.floor(Math.random() * COLOR_PALETTE.length);
    return COLOR_PALETTE[index];
  }, []);

  // The main handler logic
  const colorize = useCallback(
    (el: HTMLDivElement) => {
      // 1. Determine the color to use
      const activeColor = color === 'random' ? getRandomColor() : color;

      // 2. Apply color
      el.style.backgroundColor = activeColor;

      setTimeout(() => {
        el.style.backgroundColor = 'transparent';
      }, 300);
    },
    [color, getRandomColor],
  );

  // Use a stable handler wrapper for onMouseEnter
  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      colorize(e.currentTarget);
    },
    [colorize],
  );

  const { colWidth, numCols, numBlocks } = useMemo(() => {
    // If windowSize.width is 0, these will be based on 0, but that's fine,
    // as the component will return null immediately after.
    const cw = Math.floor(windowSize.width * 0.05) || 50; // Use a default if 0
    const nc = Math.ceil(windowSize.width / cw);
    const nb = Math.ceil(windowSize.height / cw);
    return { colWidth: cw, numCols: nc, numBlocks: nb };
  }, [windowSize.width, windowSize.height]);

  // Conditional return (must come AFTER all hook calls)
  if (windowSize.width === 0) return null;

  return (
    <div className="absolute inset-0 flex overflow-hidden z-0">
      {Array.from({ length: numCols }).map((_, colIdx) => (
        <div key={colIdx} style={{ width: `${colWidth}px` }} className="flex flex-col">
          {Array.from({ length: numBlocks }).map((_, blockIdx) => (
            <div
              key={blockIdx}
              style={{ height: `${colWidth}px` }}
              className="w-full transition-colors duration-300"
              onMouseEnter={handleMouseEnter}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
