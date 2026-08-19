'use client';

import { ReactElement, ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Magnetic } from './Magnetic';

// Extend default button props
type RoundedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode | ReactElement;
  backgroundColor?: string;
  className?: string;
};

const RoundedButton = ({
  children,
  backgroundColor = 'var(--flame-500)',
  className,
  ...props
}: RoundedButtonProps) => {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<GSAPTimeline>(null!);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(
        circle.current,
        {
          top: '-25%',
          scale: 1.5,
          duration: 0.4,
          ease: 'power3.in',
        },
        'enter',
      )
      .to(
        circle.current,
        {
          top: '-150%',
          scale: 1.25,
          duration: 0.25,
        },
        'exit',
      );
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeline.current.tweenFromTo('enter', 'exit');
  };

  const manageMouseLeave = () => {
    timeoutId.current = setTimeout(() => {
      timeline.current.play();
    }, 300);
  };

  const defaultClasses =
    '-z-20 relative flex items-center justify-center px-12 py-2 border border-border rounded-full overflow-hidden hover:text-gray-100 hover:border-none';

  return (
    <Magnetic>
      <button
        {...props}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        className={
          className
            ? `-z-20 relative flex items-center justify-center overflow-hidden ${className}`
            : defaultClasses
        }
      >
        {children}
        <div
          ref={circle}
          style={{ backgroundColor }}
          className="absolute top-full left-0 w-full h-full rounded-full -z-10"
        />
      </button>
    </Magnetic>
  );
};

export default RoundedButton;
