'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeIn, staggerContainer } from '@/utils/motion';
import { useEffect } from 'react';
import { Magnetic } from './Magnetic';
import SectionWrapper from './SectionWrapper';
import DisperseText from './DisperseText';
import { PixelTrailBackground } from './PixelTrailBackground';

const Error404 = () => {
  useEffect(() => {
    document.title = '404 — Page Not Found';
  }, []);

  return (
    <SectionWrapper className="max-w-screen w-full relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] px-4 pb-[500px]">
      <PixelTrailBackground />
      <motion.main
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
        className="z-10 flex flex-col items-center justify-center gap-4"
      >
        <motion.h1
          variants={fadeIn('down', 'spring', 0, 0.6)}
          className="text-9xl font-heading font-bold mb-4 text-flame-500 hover:text-flame-300"
        >
          <DisperseText>404</DisperseText>
        </motion.h1>

        <motion.p variants={fadeIn('up', 'tween', 0.1, 0.5)} className="text-xl mb-8 max-w-md">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        <motion.div variants={fadeIn('up', 'tween', 0.2, 0.5)}>
          <Link href="/" passHref>
            <Magnetic>
              <div className="rounded-full font-bodyBold w-fit px-8 py-2 bg-lemon text-gray-700 hover:bg-canvas hover:border-2 hover:border-border hover:text-content-muted">
                Go Back Home
              </div>
            </Magnetic>
          </Link>
        </motion.div>
      </motion.main>
    </SectionWrapper>
  );
};

export default Error404;
