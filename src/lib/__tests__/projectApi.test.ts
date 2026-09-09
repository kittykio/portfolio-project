import { getAllProjects } from '@/lib/projectApi';

const currentSlugs = [
  'bad-ui-olympics',
  'tempo',
  'workio',
  'kiki-world',
  'kiki-arcade',
  'booktrace',
];

describe('project catalogue', () => {
  it.each(['en', 'ja'] as const)('normalizes the %s catalogue', async (locale) => {
    const projects = await getAllProjects(locale);
    expect(projects.map(({ slug }) => slug)).toEqual(currentSlugs);
    expect(new Set(projects.map(({ id }) => id)).size).toBe(projects.length);
    projects.forEach((project) => {
      expect(project.id).toBeGreaterThanOrEqual(1_000_000_000);
      expect(project.slug).toBeTruthy();
      expect(project.createdDate).toBeInstanceOf(Date);
      expect(project.modifiedDate).toBeInstanceOf(Date);
      expect(project.like).toBe(0);
      if (project.slug === 'bad-ui-olympics') {
        expect(project.date).toBe('2026/09/09');
        expect(project.image).toBe('/projects/bad-ui-olympics.svg');
        expect(project.websiteUrl).toBe('');
        expect(project.repoUrl).toBe('https://github.com/kittykio/bad-ui-olympics');
        return;
      }
      expect(project.date).toBe(project.slug === 'tempo' ? '2026/09/08' : '2026/09/04');
      expect(project.image).toBe(`/projects/${project.slug}.png`);
      expect(project.repoUrl).toBe(`https://github.com/kittykio/${project.slug}`);
      expect(project.websiteUrl).toBe(
        `https://kiki-${project.slug.replace(/^kiki-/, '')}.vercel.app/`,
      );
      expect(project.livePreview).toBe(true);
      expect(project.caseStudy).toEqual(
        expect.objectContaining({
          eyebrow: expect.any(String),
          statement: expect.any(String),
          problem: expect.any(String),
          role: expect.any(String),
          constraints: expect.any(String),
          process: expect.any(String),
          result: expect.any(String),
          features: expect.arrayContaining([expect.any(String)]),
          engineering: expect.arrayContaining([expect.any(String)]),
        }),
      );
    });
  });

  it('defaults to the English catalogue and generates stable IDs', async () => {
    expect(await getAllProjects()).toEqual(await getAllProjects('en'));
  });

  it('keeps both locale catalogues structurally aligned', async () => {
    const [english, japanese] = await Promise.all([getAllProjects('en'), getAllProjects('ja')]);

    expect(japanese.map(({ slug }) => slug)).toEqual(english.map(({ slug }) => slug));
    japanese.forEach((project, index) => {
      expect(project.image).toBe(english[index].image);
      expect(project.repoUrl).toBe(english[index].repoUrl);
      expect(project.websiteUrl).toBe(english[index].websiteUrl);
      expect(project.livePreview).toBe(english[index].livePreview);
      expect(project.caseStudy?.features).toHaveLength(
        english[index].caseStudy?.features?.length ?? 0,
      );
      expect(project.caseStudy?.engineering).toHaveLength(
        english[index].caseStudy?.engineering?.length ?? 0,
      );
    });
  });
});
