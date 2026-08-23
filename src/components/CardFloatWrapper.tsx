import { ReactNode, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, useAnimation, useInView } from 'framer-motion';

type Props = {
  children: ReactNode;
  /** Position in the surrounding list, used to stagger the floating loop. */
  index?: number;
  className?: string;
  /** Disable tilt where pointer-driven motion would conflict with another interaction. */
  tilt?: boolean;
};

/** Starts the decorative float only while the card is near the viewport. */
const CardFloatWrapper = ({ children, index = 0, className, tilt = true }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, amount: 0.25 });

  useEffect(() => {
    if (!ref.current) return;

    const run = async () => {
      if (inView) {
        await controls.start({
          y: [0, -12, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: index * 0.75,
          },
        });
      } else {
        // Reset off-screen cards so they re-enter from a predictable position.
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
      {tilt ? (
        <Tilt className="max-h-fit">
          <motion.div ref={ref} animate={controls} className={`${className ? className : ''}`}>
            {children}
          </motion.div>
        </Tilt>
      ) : (
        <motion.div ref={ref} animate={controls} className={`${className ? className : ''}`}>
          {children}
        </motion.div>
      )}
    </>
  );
};

type CardProps = {
  children: ReactNode;
  rounded?: boolean;
  className?: string;
};

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
