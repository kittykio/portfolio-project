import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project',
};

const ProjectLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full">{children}</div>;
};

export default ProjectLayout;
