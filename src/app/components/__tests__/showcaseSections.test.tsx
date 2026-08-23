import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BlogSection from '@/app/components/BlogSection';
import ProjectSection from '@/app/components/ProjectSection';
import type { PostType } from '@/types/PostType';
import type { ProjectType } from '@/types/ProjectType';

let locale = 'en'; const start = jest.fn().mockResolvedValue(undefined); const stop = jest.fn(); const set = jest.fn(); let currentMotionValue = -25;
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/SectionWrapper', () => ({ children, title }: React.PropsWithChildren<{ title: string }>) => <section><h2>{title}</h2>{children}</section>);
jest.mock('@/components/PostItem', () => ({ post }: { post: PostType }) => <article>{post.title}:{post.likesPerUser}</article>);
jest.mock('@/components/ProjectItem', () => ({ project, onSelect }: { project: ProjectType; onSelect: (project: ProjectType) => void }) => <button onClick={() => onSelect(project)}>{project.title}:{project.likesPerUser}</button>);
jest.mock('@/app/projects/components/ProjectModal', () => ({ isOpen, onClose, project }: { isOpen: boolean; onClose: () => void; project?: ProjectType }) => isOpen ? <div role="dialog"><span>{project?.title}</span><button onClick={onClose}>Close modal</button></div> : null);
jest.mock('framer-motion', () => { const React = require('react'); return { motion: { div: React.forwardRef(({ children, animate, style, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>) }, useAnimation: () => ({ start, stop }), useMotionValue: () => ({ set, get: () => currentMotionValue }) }; });

const post = (id: number): PostType => ({ id, slug: [`post-${id}`], date: '2025-01-01', like: 0, title: `Post ${id}`, description: '', image: '/p.png', tags: [], headings: [], createdDate: new Date(), createdLocaleDate: '', modifiedDate: new Date(), readingTime: 1 });
const project = (id: number): ProjectType => ({ id, slug: `project-${id}`, date: '2025-01-01', like: 0, title: `Project ${id}`, image: '/p.png', tags: [], createdDate: new Date(), createdLocaleDate: '', modifiedDate: new Date() });

describe('home showcase sections', () => {
  beforeAll(() => { Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 400 }); Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 600 }); });
  beforeEach(() => { locale = 'en'; start.mockClear(); stop.mockClear(); set.mockClear(); localStorage.clear(); currentMotionValue = -25; });

  it('hydrates and distributes posts into animated columns', async () => {
    localStorage.setItem('portfolio-project:likes:blog:1', '2'); const { container, rerender } = render(<BlogSection posts={Array.from({ length: 6 }, (_, index) => post(index + 1))} />);
    await waitFor(() => expect(screen.getAllByText(/Post/)).toHaveLength(12)); expect(screen.getByRole('heading', { name: 'Blog' })).toBeInTheDocument(); expect(screen.getAllByText('Post 1:2')).toHaveLength(2); await waitFor(() => expect(start).toHaveBeenCalled());
    const columns = container.querySelectorAll('section section > div'); fireEvent.mouseEnter(columns[0]); expect(stop).toHaveBeenCalled(); fireEvent.mouseLeave(columns[0]); expect(set).toHaveBeenCalled();
    currentMotionValue = 25; fireEvent.mouseLeave(columns[1]); locale = 'ja'; rerender(<BlogSection posts={[post(1), post(2), post(3)]} />); expect(screen.getByRole('heading', { name: 'ブログ' })).toBeInTheDocument();
  });

  it('returns no blog section for empty posts', () => { const { container } = render(<BlogSection posts={[]} />); expect(container).toBeEmptyDOMElement(); });

  it('hydrates project rows, pauses/resumes, opens and closes selection, and localizes', async () => {
    localStorage.setItem('portfolio-project:likes:project:1', '3'); const { container, rerender } = render(<ProjectSection projects={[project(1), project(2)]} />); await waitFor(() => expect(screen.getAllByRole('button', { name: /Project/ })).toHaveLength(8)); expect(screen.getByRole('heading', { name: 'Featured projects' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Project 1:3/ })[0]); expect(screen.getByRole('dialog')).toHaveTextContent('Project 1'); fireEvent.click(screen.getByRole('button', { name: 'Close modal' })); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const rows = container.querySelectorAll('section section > div'); fireEvent.mouseEnter(rows[0]); fireEvent.mouseLeave(rows[0]); currentMotionValue = 25; fireEvent.mouseLeave(rows[1]); expect(stop).toHaveBeenCalled(); expect(start).toHaveBeenCalled();
    locale = 'ja'; rerender(<ProjectSection projects={[project(1)]} />); expect(screen.getByRole('heading', { name: '注目のプロジェクト' })).toBeInTheDocument();
  });
});
