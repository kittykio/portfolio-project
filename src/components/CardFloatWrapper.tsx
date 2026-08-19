import { ReactNode, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, useAnimation, useInView } from 'framer-motion';

// Defines the properties for the CardFloatWrapper component.
type Props = {
  // The content to be rendered inside the wrapper.
  children: ReactNode;
  // An optional index used to stagger the animation start time. Defaults to 0.
  index?: number;
  // Optional custom class names to apply to the motion div.
  className?: string;
  // A boolean flag to enable or disable the `react-tilt` library effect. Defaults to true.
  tilt?: boolean;
};

// A wrapper component that applies a floating parallax animation and an optional tilt effect to its children.
const CardFloatWrapper = ({ children, index = 0, className, tilt = true }: Props) => {
  // Reference to the main div element for scroll tracking and animation control.
  const ref = useRef<HTMLDivElement | null>(null);
  // Animation controls from framer-motion to manually start and stop animations.
  const controls = useAnimation();
  // Tracks whether the component is currently visible in the viewport.
  const inView = useInView(ref, { once: false, amount: 0.25 });

  // Effect to manage the floating animation based on component visibility.
  useEffect(() => {
    // Exits if the ref is not yet assigned.
    if (!ref.current) return;

    // Async function to control the animation flow.
    const run = async () => {
      if (inView) {
        // Starts the floating animation (up and down loop) when the component enters the view.
        await controls.start({
          y: [0, -12, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            // Staggers the animation start based on the provided index.
            delay: index * 0.75,
          },
        });
      } else {
        // Resets the vertical position to 0 when the component leaves the view.
        void controls.start({
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        });
      }
    };

    void run();
  }, [inView, controls, index]);

  return (
    <>
      {/* Conditionally renders with the Tilt effect. */}
      {tilt ? (
        <Tilt className="max-h-fit">
          <motion.div ref={ref} animate={controls} className={`${className ? className : ''}`}>
            {children}
          </motion.div>
        </Tilt>
      ) : (
        // Renders without the Tilt effect, only applying the floating motion.
        <motion.div ref={ref} animate={controls} className={`${className ? className : ''}`}>
          {children}
        </motion.div>
      )}
    </>
  );
};

// Defines the properties for the basic Card component.
type CardProps = {
  // The content inside the card.
  children: ReactNode;
  // A boolean flag to apply rounded corners. Defaults to false.
  rounded?: boolean;
  // Optional custom class names.
  className?: string;
};

// A simple styled container component for content, designed to look like a card.
const Card = ({ children, rounded = false, className }: CardProps) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col justify-center items-center bg-canvas shadow-shadowed shadow-lg ${rounded ? 'rounded-lg' : ''} ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};

export { CardFloatWrapper, Card };
