import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProjectPageClient from '@/app/projects/components/ProjectPageClient';
import { trackEvent } from '@/components/AnalyticsEvent';
import type { ProjectType } from '@/types/ProjectType';

let locale = 'en'; let query = ''; const replace = jest.fn();
jest.mock('next/navigation', () => ({ usePathname: () => locale === 'ja' ? '/ja/projects' : '/projects', useRouter: () => ({ replace }), useSearchParams: () => new URLSearchParams(query) }));
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: jest.fn() }));
jest.mock('@/components/SectionWrapper', () => ({ children, title }: React.PropsWithChildren<{ title: string }>) => <main><h1>{title}</h1>{children}</main>);
jest.mock('@/app/projects/components/ProjectFilter', () => ({ __esModule: true, default: ({ projects, onFiltersChange }: { projects: ProjectType[]; onFiltersChange: (filters: { years: Set<string>; tags: Set<string> }) => void }) => <div><span>Filters:{projects.length}</span><button onClick={() => onFiltersChange({ years: new Set(['2024']), tags: new Set(['React']) })}>Apply filters</button><button onClick={() => onFiltersChange({ years: new Set(), tags: new Set() })}>Clear filters</button></div> }));
jest.mock('@/components/SortTabs', () => ({ __esModule: true, default: ({ onChange }: { onChange: (sort: string | null) => void }) => <div><button onClick={() => onChange('mostPopular')}>Popular</button><button onClick={() => onChange('newest')}>Newest</button><button onClick={() => onChange('oldest')}>Oldest</button><button onClick={() => onChange(null)}>Default</button></div> }));
jest.mock('@/app/projects/components/ProjectList', () => ({ __esModule: true, default: ({ projects, onLikesChange }: { projects: ProjectType[]; onLikesChange: (projects: ProjectType[]) => void }) => <section data-testid="projects"><span>{projects.map((project) => `${project.title}:${project.like}`).join('|')}</span><button onClick={() => onLikesChange(projects.map((project) => ({ ...project, like: project.like + 10 })))}>Change likes</button></section> }));
jest.mock('@/components/Pagination', () => ({ __esModule: true, default: ({ total, onPageChange }: { total: number; onPageChange: (page: number) => void }) => <div>Pages:{total}<button onClick={() => onPageChange(2)}>Page two</button></div> }));

const project = (id: number, date: string, like: number, tags = ['React']): ProjectType => ({ id, slug: `p-${id}`, date, like, title: `P${id}`, image: '/p.png', tags, createdDate: new Date(), createdLocaleDate: '', modifiedDate: new Date() });
const projects = [project(1, '2023-01-01', 2), project(2, '2025-01-01', 1, ['Vue']), project(3, '2024-01-01', 8), project(4, '', 3), project(5, '2022-01-01', 4), project(6, '2021-01-01', 5), project(7, '2020-01-01', 6)];

describe('ProjectPageClient', () => {
  beforeEach(() => { locale = 'en'; query = ''; replace.mockClear(); global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ likes: { 1: 20, 3: 30 } }) } as Response); });

  it('loads remote totals and applies all sorting and pagination modes', async () => {
    render(<ProjectPageClient initialProjects={projects} />); await waitFor(() => expect(screen.getByTestId('projects')).toHaveTextContent('P1:20')); expect(screen.getByText('Pages:7')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Popular' })); expect(screen.getByTestId('projects').textContent).toMatch(/^P3:30/); fireEvent.click(screen.getByRole('button', { name: 'Newest' })); expect(screen.getByTestId('projects').textContent).toMatch(/^P2:1/); fireEvent.click(screen.getByRole('button', { name: 'Oldest' })); expect(screen.getByTestId('projects')).toHaveTextContent('P4:3'); fireEvent.click(screen.getByRole('button', { name: 'Default' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page two' })); expect(screen.getByTestId('projects')).toHaveTextContent('P7:6'); fireEvent.click(screen.getByRole('button', { name: 'Change likes' }));
  });

  it('filters, synchronizes sorted URL parameters, tracks events, and clears', () => {
    render(<ProjectPageClient initialProjects={projects} />); fireEvent.click(screen.getByRole('button', { name: 'Apply filters' })); expect(screen.getByTestId('projects')).toHaveTextContent('P3'); expect(replace).toHaveBeenCalledWith('/projects?year=2024&tag=React', { scroll: false }); expect(trackEvent).toHaveBeenCalledWith('filter', 'React, 2024'); fireEvent.click(screen.getByRole('button', { name: 'Clear filters' })); expect(replace).toHaveBeenLastCalledWith('/projects', { scroll: false });
  });

  it('restores URL filters, tolerates reaction failure, and localizes', async () => {
    locale = 'ja'; query = 'year=2023&tag=React'; global.fetch = jest.fn().mockRejectedValue(new Error('offline')); render(<ProjectPageClient initialProjects={projects} />); await waitFor(() => expect(screen.getByTestId('projects')).toHaveTextContent('P1:2')); expect(screen.getByRole('heading', { name: 'プロジェクト' })).toBeInTheDocument();
  });
});
