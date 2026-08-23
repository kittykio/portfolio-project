'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { colorPalette } from '@/constants/colorPalette';

type ColorKey = 'var(--flame-500)' | 'var(--lemon)' | 'random';

type Props = {
  color?: ColorKey;
};

// Canvas cannot resolve theme variables, so random trails use concrete palette values.
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

  const getRandomColor = useCallback(() => {
    const index = Math.floor(Math.random() * COLOR_PALETTE.length);
    return COLOR_PALETTE[index];
  }, []);

  const colorize = useCallback(
    (el: HTMLDivElement) => {
      const activeColor = color === 'random' ? getRandomColor() : color;
      el.style.backgroundColor = activeColor;

      // Match the CSS transition duration before returning the cell to its transparent state.
      setTimeout(() => {
        el.style.backgroundColor = 'transparent';
      }, 300);
    },
    [color, getRandomColor],
  );

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      colorize(e.currentTarget);
    },
    [colorize],
  );

  const { colWidth, numCols, numBlocks } = useMemo(() => {
    // Five-percent cells keep the DOM bounded at roughly 20 columns on every viewport.
    const cw = Math.floor(windowSize.width * 0.05) || 50;
    const nc = Math.ceil(windowSize.width / cw);
    const nb = Math.ceil(windowSize.height / cw);
    return { colWidth: cw, numCols: nc, numBlocks: nb };
  }, [windowSize.width, windowSize.height]);

  // Avoid a server/client grid mismatch; the resize effect supplies real dimensions after mount.
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
