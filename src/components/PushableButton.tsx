import React, { FC, useId, ReactNode } from 'react';

// --- Types and Constants ---

type Shape = 'heart' | 'moon' | 'sun';

interface PushableButtonProps {
  children?: ReactNode;
  shape?: Shape;
  size?: 16 | 24 | 32 | 40 | 48 | 64 | 128;
  backColor?: string;
  frontColor?: string;
  className?: string;
  onClick?: () => void;
}

interface ShapeRendererProps {
  shape: Shape;
  color: string;
  isFrontLayer: boolean;
  uid: string;
}

// Map for the vertical sizeOffsets of the 'back' layer (The push depth).
const sizeOffsets = {
  16: 1,
  24: 1,
  32: 2,
  40: 2,
  48: 3,
  64: 5,
  128: 10,
};

const VIEWBOX_SIZE = '48';
const heartPath =
  'M24 44 C20 40 4 28 4 15 C4 8 8 4 15 4 C19 4 21 6 24 9 C27 6 29 4 33 4 C40 4 44 8 44 15 C44 28 28 40 24 44 Z';

// --- Shape Renderer Helper Component ---

const ShapeRenderer: FC<ShapeRendererProps> = ({ shape, color, isFrontLayer, uid }) => {
  const moonMaskId = isFrontLayer ? `moonMaskTop-${uid}` : `moonMask-${uid}`;
  const moonMaskCX = isFrontLayer ? 28.5 : 30;
  const moonMaskCY = isFrontLayer ? 16.5 : 18;
  const moonMaskR = isFrontLayer ? 11 : 12;

  if (shape === 'heart') {
    return <path d={heartPath} fill={color} />;
  }

  if (shape === 'moon') {
    return (
      <g>
        <defs>
          <mask id={moonMaskId}>
            <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill="white" />
            <circle cx={moonMaskCX} cy={moonMaskCY} r={moonMaskR} fill="black" />
          </mask>
        </defs>
        <circle cx="24" cy="24" r="16" fill={color} mask={`url(#${moonMaskId})`} />
      </g>
    );
  }

  if (shape === 'sun') {
    return (
      <g>
        <circle cx="24" cy="24" r="10" fill={color} />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = i * 45;
          return (
            <rect
              key={i}
              x="33"
              y="10"
              width="2"
              height="8"
              rx="1"
              transform={`rotate(${angle} 24 24)`}
              fill={color}
            />
          );
        })}
      </g>
    );
  }

  return null;
};

const PushableButton: React.FC<PushableButtonProps> = ({
  children,
  shape = 'heart',
  size = 48,
  backColor = 'var(--flame-900)',
  frontColor = 'var(--flame-500)',
  className = '',
}) => {
  const reactId = useId();
  const uid = `pb-${reactId}`;
  const viewBox = `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`;
  const offsetAmount = sizeOffsets[size];
  const fontSize = Math.max(10, Math.round(size / 3.5));
  const frontLayerInitialTranslate = `translateY(-${offsetAmount}px)`;

  return (
    <button
      type="button"
      className={`relative p-0 cursor-pointer outline-none focus:outline-none group${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Back Layer (The 'Shadow' or 'Pushed' part) */}
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{ transform: `translateY(${offsetAmount}px)` }}
        aria-hidden
      >
        <ShapeRenderer shape={shape} color={backColor} isFrontLayer={false} uid={uid} />
      </svg>

      {/* 2. Front Layer (The Interactive part) */}
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute inset-0 transition-transform duration-150 ease-in-out -translate-y-1 group-active:translate-y-0 hover:scale-110`}
        aria-hidden
      >
        <ShapeRenderer shape={shape} color={frontColor} isFrontLayer={true} uid={uid} />
      </svg>

      {/* 3. Text/Children Layer (Also needs to follow the front layer to stay centered) */}
      <span
        className={`absolute inset-0 flex items-center justify-center text-white select-none pointer-events-none transition-transform duration-150 ease-in-out group-active:translate-y-0`}
        style={{
          fontSize: fontSize,
          // Set the initial position to match the front SVG.
          transform: frontLayerInitialTranslate,
        }}
      >
        {children}
      </span>
    </button>
  );
};

export default PushableButton;
