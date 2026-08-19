import React, { Children, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { disperse } from '../utils/anim';

// Defines the properties for the DisperseText component.
type TextDisperseProps = {
  // The content to be dispersed, typically text.
  children: ReactNode;
  // An optional callback function to set a reference state in a parent component.
  setRef?: (active: boolean) => void;
  /** Adds the dev-portfolio-style staggered letter bounce until the text is hovered. */
  bounce?: boolean;
};

// Defines the expected type for a character element wrapped in motion.span.
type CharElement = React.ReactElement<ReactNode, string | React.JSXElementConstructor<ReactNode>>;

// Defines a type for a valid React element that may contain children.
type ValidChildElement = React.ReactElement<{ children?: ReactNode }>;

// A component that takes text content and disperses its characters on hover.
const DisperseText = ({ children, setRef, bounce = false }: TextDisperseProps) => {
  // State to control the animation. True when hovered.
  const [isAnimated, setIsAnimated] = useState(false);

  // Splits a string into an array of animated span elements, one per character.
  const splitWord = (text: string): CharElement[] => {
    const length = text.length;

    return text.split('').map((char, i) => (
      <motion.span
        key={text + i}
        // Passes the character's index for custom animation logic.
        custom={i}
        // Defines animation variants using the external 'disperse' logic.
        variants={{
          // 'open' state uses the specific animation for the index and total length.
          open: () => disperse.open(i, length),
          // 'closed' state uses the default 'closed' animation.
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
        // Applies the animation based on the component's hover state.
        animate={isAnimated ? 'open' : bounce ? 'bounce' : 'closed'}
        // Ensures spans appear side-by-side for text flow.
        style={{ display: 'inline-block' }}
      >
        {/* Replaces standard space with a non-breaking space for layout consistency. */}
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    )) as CharElement[];
  };

  // Recursively processes the component's children to extract and wrap all text content.
  const getDispersedChildren = (content: ReactNode): CharElement[] => {
    const charsArray: CharElement[] = [];

    // Iterates over all children elements.
    Children.forEach(content, (child) => {
      // Processes string or number children by splitting them into animated characters.
      if (typeof child === 'string' || typeof child === 'number') {
        charsArray.push(...splitWord(String(child)));
        // Recursively handles valid React elements that contain children.
      } else if (React.isValidElement(child) && 'children' in child.props) {
        const typedChild = child as ValidChildElement;

        charsArray.push(...getDispersedChildren(typedChild.props.children));
      }
    });

    return charsArray;
  };

  // Handler for when the mouse enters the component.
  const handleMouseEnter = () => {
    // Calls the optional setRef callback with 'true' to indicate activity.
    setRef?.(true);
    // Triggers the 'open' animation state.
    setIsAnimated(true);
  };

  // Handler for when the mouse leaves the component.
  const handleMouseLeave = () => {
    // Calls the optional setRef callback with 'false' to indicate inactivity.
    setRef?.(false);
    // Triggers the 'closed' animation state.
    setIsAnimated(false);
  };

  return (
    // The wrapper span which handles the hover events and contains the dispersed text.
    <span
      className="flex cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Renders the array of animated character elements. */}
      {getDispersedChildren(children)}
    </span>
  );
};

export default DisperseText;
