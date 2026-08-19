import Image, { ImageProps } from 'next/image';
import type { ComponentPropsWithoutRef, FC } from 'react';
// Imports the FileTree component and its associated type for use as an MDX component.
import FileTree, { FileNode } from './FileTree';

// --- Image ---
/**
 * Custom component for rendering images in MDX, enforcing the use of Next.js's Image component.
 */
export const Img = ({ alt, ...props }: ImageProps) => <Image alt={alt} {...props} />;

// --- Headings ---
// Custom heading components with Tailwind CSS styling for consistent blog formatting,
// including scroll-mt for smooth navigation with anchor links.

export const h1: FC<ComponentPropsWithoutRef<'h1'>> = (props) => (
  <h1 {...props} className="font-bodyBold text-3xl my-6 scroll-mt-24" />
);

export const h2: FC<ComponentPropsWithoutRef<'h2'>> = (props) => (
  <h2 {...props} className="font-bodyBold text-2xl my-6 scroll-mt-24" />
);

export const h3: FC<ComponentPropsWithoutRef<'h3'>> = (props) => (
  <h3 {...props} className="font-bodyBold text-xl my-6 scroll-mt-24" />
);

export const h4: FC<ComponentPropsWithoutRef<'h4'>> = (props) => (
  <h4 {...props} className="font-bodyBold text-lg my-5 scroll-mt-24" />
);

export const h5: FC<ComponentPropsWithoutRef<'h5'>> = (props) => (
  <h5 {...props} className="font-bodyBold text-base my-5 scroll-mt-24" />
);

export const h6: FC<ComponentPropsWithoutRef<'h6'>> = (props) => (
  <h6 {...props} className="font-bodyBold text-sm my-4 scroll-mt-24" />
);

// --- Text ---
/**
 * Custom paragraph component with consistent vertical spacing and line height.
 */
export const p: FC<ComponentPropsWithoutRef<'p'>> = (props) => <p {...props} className="my-2" />;

/**
 * Custom anchor/link component with specific styling and hover transition.
 */
export const a: FC<ComponentPropsWithoutRef<'a'>> = ({ children, href, ...props }) => (
  <a href={href} {...props} className="text-flame-500 underline hover:text-flame-700 transition">
    {children}
  </a>
);

/**
 * Custom blockquote component with a left border for emphasis.
 */
export const blockquote: FC<ComponentPropsWithoutRef<'blockquote'>> = (props) => (
  <blockquote {...props} className="border-l-4 border-flame-500 pl-4 italic text-gray-500 my-4" />
);

/**
 * Custom strong component for bold text with a distinct color.
 */
export const strong: FC<ComponentPropsWithoutRef<'strong'>> = (props) => (
  <strong {...props} className="font-bodyBold" />
);

/**
 * Custom emphasis component for italic text with a distinct color.
 */
export const em: FC<ComponentPropsWithoutRef<'em'>> = (props) => (
  <em {...props} className="italic tracking-wider text-content" />
);

/**
 * Custom strikethrough/delete component.
 */
export const del: FC<ComponentPropsWithoutRef<'del'>> = (props) => (
  <del {...props} className="line-through" />
);

// --- Lists ---
/**
 * Custom unordered list component with disk markers and spacing.
 */
export const ul: FC<ComponentPropsWithoutRef<'ul'>> = (props) => (
  <ul {...props} className="list-disc list-outside pl-6 my-2 space-y-1" />
);

/**
 * Custom ordered list component with decimal markers and spacing.
 */
export const ol: FC<ComponentPropsWithoutRef<'ol'>> = (props) => (
  <ol {...props} className="list-decimal list-outside pl-6 my-2 space-y-1" />
);

/**
 * Custom list item component with consistent line height.
 */
export const li: FC<ComponentPropsWithoutRef<'li'>> = (props) => <li {...props} />;

// --- Code ---
// Note: The inline `code` component is commented out, suggesting it's handled by a syntax highlighter or left to default.
// export const code: FC<ComponentPropsWithoutRef<'code'>> = (props) => (
//   <code
//     {...props}
//     className="bg-surface-inverse text-content-inverse px-1.5 py-0.5 rounded text-sm font-mono"
//   />
// );

/**
 * Custom pre-formatted text/code block wrapper with dark background and overflow handling.
 */
export const pre: FC<ComponentPropsWithoutRef<'pre'>> = (props) => (
  <pre
    {...props}
    className="my-4 overflow-x-auto rounded-lg border border-code-border bg-code-surface p-5 text-sm leading-7 text-code-content font-mono shadow-inner"
  />
);

// --- Tables ---
/**
 * Custom table component with full width and defined borders.
 */
export const table: FC<ComponentPropsWithoutRef<'table'>> = (props) => (
  <table {...props} className="w-full border-collapse border border-border my-4 text-sm" />
);

/**
 * Custom table header group component with a distinct background color.
 */
export const thead: FC<ComponentPropsWithoutRef<'thead'>> = (props) => (
  <thead {...props} className="bg-surface-inverse" />
);

/**
 * Custom table body component.
 */
export const tbody: FC<ComponentPropsWithoutRef<'tbody'>> = (props) => <tbody {...props} />;

/**
 * Custom table row component with a bottom border.
 */
export const tr: FC<ComponentPropsWithoutRef<'tr'>> = (props) => (
  <tr {...props} className="border-b border-border" />
);

/**
 * Custom table header cell component with padding and alignment.
 */
export const th: FC<ComponentPropsWithoutRef<'th'>> = (props) => (
  <th {...props} className="px-3 py-2 text-left font-bodyBold" />
);

/**
 * Custom table data cell component with padding.
 */
export const td: FC<ComponentPropsWithoutRef<'td'>> = (props) => (
  <td {...props} className="px-3 py-2" />
);

// --- Task lists ---
/**
 * Custom input component, primarily targeting checkboxes to apply specific styling.
 */
export const input: FC<ComponentPropsWithoutRef<'input'>> = (props) =>
  props.type === 'checkbox' ? (
    <input {...props} className="mr-2 accent-flame-500" />
  ) : (
    <input {...props} />
  );

// --- Divider ---
/**
 * Custom horizontal rule/divider component.
 */
export const Divider: FC = () => <hr className="flex-grow border-t-2 border-border my-6" />;

// --- File Links ---
interface FileLinkProps {
  name: string;
  label?: string;
}

/**
 * Custom component to render a downloadable file link.
 */
export const FileLink: FC<FileLinkProps> = ({ name, label }) => (
  <a href={name} download className="text-flame-500 underline hover:text-flame-700 transition">
    {label || name.split('/').pop()}
  </a>
);

// --- Font/Block Props ---
interface FontProps extends ComponentPropsWithoutRef<'span'> {
  // If true, renders as a <div> instead of a <span>, acting as a block-level element.
  block?: boolean;
}

// --- Custom Fonts ---
// Custom components to apply different font styles, colors, and tracking to text.

export const Awkward: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag {...props} className={`font-awkward text-2xl tracking-wider ${block ? 'my-2' : ''}`}>
      {children}
    </Tag>
  );
};

export const Spacey: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag
      {...props}
      className={`font-spacey bg-surface-inverse text-content-inverse px-2 tracking-widest ${
        block ? 'my-2' : ''
      }`}
    >
      {children}
    </Tag>
  );
};

export const Playful: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag {...props} className={`font-playful text-2xl ${block ? 'my-2' : ''}`}>
      {children}
    </Tag>
  );
};

export const Saucy: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag {...props} className={`${block ? 'my-2' : ''} font-saucy`}>
      {children}
    </Tag>
  );
};

export const Loud: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag {...props} className={`font-loud tracking-widest uppercase ${block ? 'my-2' : ''}`}>
      {children}
    </Tag>
  );
};

export const Sparkly: FC<FontProps> = ({ block, children, ...props }) => {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag {...props} className={`${block ? 'my-2' : ''} font-sparkly`}>
      {children}
    </Tag>
  );
};

/**
 * Custom component to underline text with a distinct color.
 */
export const Underline: FC<ComponentPropsWithoutRef<'span'>> = ({ children, ...props }) => (
  <span
    {...props}
    className="underline decoration-wavy decoration-flame-300 decoration-2 underline-offset-4 font-bodyBold"
  >
    {children}
  </span>
);

/**
 * Custom component to highlight text with color emphasis.
 * Accepts `color` and `block` for block display.
 */
interface HighlightProps extends ComponentPropsWithoutRef<'span'> {
  color?: 'flame' | 'lemon';
  block?: boolean;
}

export const Highlight: FC<HighlightProps> = ({
  color = 'lemon',
  block = false,
  children,
  ...props
}) => {
  const Tag = block ? 'div' : 'span';

  const colorClassMap: Record<string, string> = {
    flame: 'bg-flame-300 text-gray-900',
    lemon: 'bg-lemon text-gray-900',
  };

  const colorClasses = colorClassMap[color] || `bg-${color} text-content-muted`;

  return (
    <Tag
      {...props}
      className={`${colorClasses} rounded-md leading-7
        ${block ? 'my-2 px-2 py-1 inline-block' : 'inline px-1 py-0.5'}
      `}
      style={{
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone',
      }}
    >
      {children}
    </Tag>
  );
};

export const RainbowHighlight: FC<Omit<HighlightProps, 'color'>> = ({
  block = false,
  children,
  ...props
}) => {
  const Tag = 'span';
  const rainbow =
    'linear-gradient(90deg, var(--rainbow-red), var(--rainbow-orange), var(--rainbow-yellow), var(--rainbow-green), var(--rainbow-blue), var(--rainbow-violet))';

  return (
    <Tag
      {...props}
      className={`bg-clip-text font-bodyBold leading-relaxed text-transparent underline decoration-flame-300 decoration-[1.5px] underline-offset-4 ${
        block ? 'my-3 inline-block max-w-full' : 'inline'
      }`}
      style={{
        backgroundImage: rainbow,
        WebkitTextStroke: '0.2px var(--gray-900)',
      }}
    >
      {children}
    </Tag>
  );
};

// --- MDX Component for File Tree ---

interface MDXFileTreeProps {
  // The file tree data structure.
  tree: FileNode[];
  // Optional file click handler.
  onFileClick?: (fileId: string) => void;
}

/**
 * MDX component that wraps the core FileTree component for use within markdown content.
 */
export const MDXFileTree: FC<MDXFileTreeProps> = ({ tree, onFileClick }) => {
  return <FileTree tree={tree} onFileClick={onFileClick} />;
};
