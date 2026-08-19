import { m, LazyMotion, domAnimation } from 'framer-motion';
import { ReactNode } from 'react';

// Defines the properties for the SectionWrapper component.
type Props = {
  // The main content of the section.
  children: ReactNode;
  // Optional main title for the section header.
  title?: string;
  // Optional subtitle or description for the section header, accepts a string or any ReactNode.
  subtitle?: string | ReactNode;
  // Optional custom class names for the wrapper div.
  className?: string;
};

/**
 * A wrapper component for sections that provides optional animated headings,
 * lazy-loaded Framer Motion capabilities, and an auto-generated anchor ID.
 */
const SectionWrapper = ({ title, subtitle, children, className }: Props) => {
  // Check if a header (title or subtitle) is provided.
  const hasHeader = Boolean(title || subtitle);

  // Generates a kebab-case ID from the title for anchor linking (e.g., "My Section Title" -> "my-section-title").
  const sectionId = title ? title.toLowerCase().split(' ').join('-') : undefined;

  return (
    // LazyMotion loads only the essential Framer Motion features (DOM manipulation) for better performance.
    <LazyMotion features={domAnimation}>
      <div
        id={sectionId} // Anchor ID for direct linking/navigation.
        // Applies default styling or uses the provided className.
        className={
          className ??
          // Default styles: ensures the section starts below fixed headers (`scroll-mt-24`), sets padding, margin, and handles header spacing.
          `scroll-mt-48 md:scroll-mt-24 flex min-w-0 flex-col my-20 px-4 w-full gap-8 `
        }
      >
        {hasHeader ? (
          // Header container for titles and subtitles.
          <div className="flex flex-col items-center mt-16 mb-10 gap-8 sm:mt-20 sm:mb-12 sm:gap-12">
            {title ? (
              // Animated main title.
              <m.h2
                initial={{ opacity: 0, y: -30 }} // Starts slightly above and invisible.
                whileInView={{ opacity: 1, y: 0 }} // Animates into view.
                viewport={{ once: true }} // Animation runs only the first time it enters the viewport.
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="font-drool text-4xl font-bodyBold uppercase tracking-wide text-content text-center sm:text-5xl md:text-6xl"
              >
                {title}
              </m.h2>
            ) : (
              <></>
            )}

            {subtitle ? (
              // Animated subtitle/description.
              <m.div
                initial={{ opacity: 0, y: 20 }} // Starts slightly below and invisible.
                whileInView={{ opacity: 1, y: 0 }} // Animates into view.
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} // Delayed start after the title.
                className="max-w-3xl text-center text-base text-wrap sm:text-lg"
              >
                {subtitle}
              </m.div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}

        {/* The main content of the section */}
        {children}
      </div>
    </LazyMotion>
  );
};

export default SectionWrapper;
