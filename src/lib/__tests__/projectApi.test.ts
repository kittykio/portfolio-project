import { getAllProjects } from '@/lib/projectApi';

describe('project catalogue', () => {
  it.each(['en', 'ja'] as const)('normalizes the %s catalogue', async (locale) => {
    const projects = await getAllProjects(locale);
    expect(projects.length).toBeGreaterThan(0);
    expect(new Set(projects.map(({ id }) => id)).size).toBe(projects.length);
    projects.forEach((project) => {
      expect(project.id).toBeGreaterThanOrEqual(1_000_000_000);
      expect(project.slug).toBeTruthy();
      expect(project.createdDate).toBeInstanceOf(Date);
      expect(project.modifiedDate).toBeInstanceOf(Date);
      expect(project.like).toBe(0);
    });
  });

  it('defaults to the English catalogue and generates stable IDs', async () => {
    expect(await getAllProjects()).toEqual(await getAllProjects('en'));
  });
});
