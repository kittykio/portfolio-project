import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
};

const BlogLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full">{children}</div>;
};

export default BlogLayout;
