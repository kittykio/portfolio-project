'use server';

import projects from '../../projects/projects.json';
import projectsJapanese from '../../projects/projects.ja.json';
import type { ProjectType } from '@/types/ProjectType';
import { defaultLocale, type Locale } from '@/i18n/config';

type ProjectSource = {
  name: string;
  title: string;
  summary: string;
  tags: string[];
  image: string;
  repoUrl: string;
  websiteUrl: string;
  date: string;
};

/**
 * Derives a stable numeric ID from the project name, so project data never
 * needs a hand-maintained database identifier. Renaming `name` intentionally
 * starts a new like record for that project.
 */
const getGeneratedProjectId = (name: string): number => {
  let hash = 2166136261;
  for (const character of name) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }

  return 1_000_000_000 + (hash >>> 0);
};

/**
 * Project content is local and stable, so normal page renders never need a database.
 * The existing project-shaped UI is intentionally reused for the floating project cards.
 */
export async function getAllProjects(
  locale: Locale = defaultLocale,
): Promise<ProjectType[]> {
  const source = locale === 'ja' ? projectsJapanese : projects;
  const projectList = (source as ProjectSource[]).map((project) => ({
    slug: project.name,
    id: getGeneratedProjectId(project.name),
    title: project.title,
    description: project.summary,
    image: project.image,
    date: project.date,
    tags: project.tags,
    like: 0,
    createdDate: new Date(project.date),
    createdLocaleDate: project.date,
    modifiedDate: new Date(project.date),
    repoUrl: project.repoUrl,
    websiteUrl: project.websiteUrl,
  }));

  if (new Set(projectList.map((project) => project.id)).size !== projectList.length) {
    throw new Error('Generated project IDs collided. Rename one of the duplicate project names.');
  }

  return projectList;
}
