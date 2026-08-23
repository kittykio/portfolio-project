import React, { Children, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { disperse } from '../utils/anim';

type TextDisperseProps = {
  children: ReactNode;
  /** Notifies a parent that the text is controlling a shared hover treatment. */
  setRef?: (active: boolean) => void;
  /** Adds the dev-portfolio-style staggered letter bounce until the text is hovered. */
  bounce?: boolean;
};

type CharElement = React.ReactElement<ReactNode, string | React.JSXElementConstructor<ReactNode>>;
type ValidChildElement = React.ReactElement<{ children?: ReactNode }>;

/** Flattens nested text content into individually animated characters. */
const DisperseText = ({ children, setRef, bounce = false }: TextDisperseProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  const splitWord = (text: string): CharElement[] => {
    const length = text.length;

    return text.split('').map((char, i) => (
      <motion.span
        key={text + i}
        custom={i}
        variants={{
          open: () => disperse.open(i, length),
          closed: disperse.closed,
          // The resting animation mirrors the dev portfolio hero: each character
          // follows the same bounce, offset slightly from the one before it.
          bounce: () => ({
            x: '0em',
            y: ['-0.28em', '0em', '-0.28em'],
            rotateZ: 0,
            transition: {
              y: {
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.09,
                ease: [0.8, 0, 0.2, 1],
              },
            },
            zIndex: 0,
          }),
        }}
        animate={isAnimated ? 'open' : bounce ? 'bounce' : 'closed'}
        style={{ display: 'inline-block' }}
      >
        {/* Preserve spacing because each character is its own inline-block. */}
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    )) as CharElement[];
  };

  // Recursion lets callers retain semantic wrappers while animation operates on their text.
  const getDispersedChildren = (content: ReactNode): CharElement[] => {
    const charsArray: CharElement[] = [];

    Children.forEach(content, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        charsArray.push(...splitWord(String(child)));
      } else if (React.isValidElement(child) && 'children' in child.props) {
        const typedChild = child as ValidChildElement;

        charsArray.push(...getDispersedChildren(typedChild.props.children));
      }
    });

    return charsArray;
  };

  const handleMouseEnter = () => {
    setRef?.(true);
    setIsAnimated(true);
  };

  const handleMouseLeave = () => {
    setRef?.(false);
    setIsAnimated(false);
  };

  return (
    <span
      className="flex cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getDispersedChildren(children)}
    </span>
  );
};

export default DisperseText;
