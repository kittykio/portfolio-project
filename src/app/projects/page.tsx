import ProjectPageClient from '@/app/projects/components/ProjectPageClient';
import { getAllProjects } from '@/lib/projectApi';
import { ProjectType } from '@/types/ProjectType';
import { getRequestLocale } from '@/i18n/server';

export const runtime = 'nodejs';

const ProjectPage = async () => {
  const projects: ProjectType[] = await getAllProjects(getRequestLocale());

  return <ProjectPageClient initialProjects={projects} />;
};

export default ProjectPage;
