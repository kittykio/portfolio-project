import { staticMetadata } from '@/lib/seo';
export const metadata = staticMetadata('/projects', 'ja');
import ProjectPageClient from '@/app/projects/components/ProjectPageClient';
import { getAllProjects } from '@/lib/projectApi';

export const runtime = 'nodejs';

const JapaneseProjectsPage = async () => <ProjectPageClient initialProjects={await getAllProjects('ja')} />;

export default JapaneseProjectsPage;
