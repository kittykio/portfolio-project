import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProjectModal from '@/app/projects/components/ProjectModal';
import ProjectFilter, { type ProjectFilters } from '@/app/projects/components/ProjectFilter';
import ProjectList from '@/app/projects/components/ProjectList';
import ProjectItem from '@/components/ProjectItem';
import PostItem from '@/components/PostItem';
import { trackEvent } from '@/components/AnalyticsEvent';
import type { ProjectType } from '@/types/ProjectType';
import type { PostType } from '@/types/PostType';

let locale = 'en'; const gsapTo = jest.fn();
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: jest.fn() }));
jest.mock('@/lib/projectAction', () => ({ updateLike: jest.fn() }));
jest.mock('@/lib/blogAction', () => ({ updateLike: jest.fn() }));
jest.mock('@/components/Magnetic', () => ({ Magnetic: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('@/components/CardFloatWrapper', () => ({ Card: ({ children }: React.PropsWithChildren) => <article>{children}</article>, CardFloatWrapper: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => <div className={className}>{children}</div> }));
jest.mock('@/components/LikeButton', () => (props: { likeItem: { title: string }; onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void }) => <button onClick={props.onClick}>Like {props.likeItem.title}</button>);
jest.mock('@/components/SaveButton', () => (props: { title: string }) => <button>Save {props.title}</button>);
jest.mock('@/components/ShareButton', () => (props: { title: string }) => <button>Share {props.title}</button>);
jest.mock('@/components/Tag', () => ({ DisplayTag: ({ tag }: { tag: string }) => <span>{tag}</span>, FilterTag: ({ tag, handleOnChange, setRef, active }: { tag: string; handleOnChange: () => void; setRef: (active: boolean) => void; active: boolean }) => <button aria-pressed={active} onMouseEnter={() => setRef(true)} onMouseLeave={() => setRef(false)} onClick={handleOnChange}>{tag}</button> }));
jest.mock('gsap', () => ({ __esModule: true, default: { to: (...args: unknown[]) => gsapTo(...args) } }));
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, variants, initial, animate, whileHover, whileTap, ...props }: any) => React.createElement(tag, props, children); return { motion: new Proxy({}, { get: (_target, tag: string) => component(tag) }) }; });
jest.mock('@headlessui/react', () => ({ Dialog: ({ children }: React.PropsWithChildren) => <div role="dialog">{children}</div>, DialogPanel: ({ children }: React.PropsWithChildren) => <div>{children}</div>, DialogTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>, Transition: ({ children, show }: React.PropsWithChildren<{ show: boolean }>) => show ? <>{children}</> : null, TransitionChild: ({ children }: React.PropsWithChildren) => <>{children}</> }));

const project = (overrides: Partial<ProjectType> = {}): ProjectType => ({ id: 1, slug: 'alpha', date: '2025-01-01', like: 2, title: 'Alpha', description: 'Alpha description', image: '/alpha.png', tags: ['React', 'UI'], createdDate: new Date(), createdLocaleDate: '', modifiedDate: new Date(), repoUrl: 'https://github.com/example/alpha', websiteUrl: 'https://alpha.example', ...overrides });
const post = (): PostType => ({ id: 2, slug: ['hello'], date: '2025-02-02', like: 1, title: 'Hello', description: 'Hello post', image: '/hello.png', tags: ['Jest'], headings: [], createdDate: new Date(), createdLocaleDate: '', modifiedDate: new Date(), readingTime: 3 });

describe('project and post UI', () => {
  beforeEach(() => { locale = 'en'; localStorage.clear(); });

  it('opens project cards with click and keyboard and resolves image dimensions', async () => {
    const onSelect = jest.fn(); const { container } = render(<ProjectItem project={project()} likeItemList={[project()]} setLikeItemList={jest.fn()} onSelect={onSelect} className="custom" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open case file for Alpha' })); expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ title: 'Alpha' })); expect(trackEvent).toHaveBeenCalledWith('project_open', 'Alpha');
    const titleControl = screen.getAllByRole('button', { name: /Alpha/ }).find((element) => element.tagName === 'DIV')!; fireEvent.keyDown(titleControl, { key: 'Escape' }); fireEvent.keyDown(titleControl, { key: 'Enter' }); expect(onSelect).toHaveBeenCalledTimes(2);
    const image = screen.getByRole('img', { name: 'Alpha' }); Object.defineProperty(image, 'naturalWidth', { value: 640 }); Object.defineProperty(image, 'naturalHeight', { value: 480 }); fireEvent.load(image);
    await waitFor(() => expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument());
  });

  it('renders localized blog cards, links, tags, and controls', () => {
    const { rerender } = render(<PostItem index={0} post={post()} postItemList={[post()]} setPostItemList={jest.fn()} />);
    expect(document.body).toHaveTextContent('3 min read'); expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/post/hello'); expect(screen.getByText('Jest')).toBeInTheDocument();
    locale = 'ja'; rerender(<PostItem index={0} post={post()} postItemList={[post()]} setPostItemList={jest.fn()} />);
    expect(document.body).toHaveTextContent('3分で読めます'); expect(screen.getByRole('link')).toHaveAttribute('href', '/ja/blog/post/hello');
  });

  it('renders a complete modal and closes from button and case-study link', () => {
    const close = jest.fn(); const item = project(); const { rerender } = render(<ProjectModal isOpen onClose={close} project={item} likeItemList={[project({ like: 9 })]} setLikeItemList={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument(); expect(screen.getByRole('heading', { name: /Alpha/ })).toBeInTheDocument(); expect(screen.getAllByText('Alpha description')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Source code' })).toHaveAttribute('href', item.repoUrl); expect(screen.getByText('Problem')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' })); fireEvent.click(screen.getByRole('link', { name: /Open full case study/ })); expect(close).toHaveBeenCalledTimes(2);
    rerender(<ProjectModal isOpen={false} onClose={close} project={item} likeItemList={[]} setLikeItemList={jest.fn()} />); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports projects without optional description or external links', () => {
    render(<ProjectModal isOpen onClose={jest.fn()} project={project({ description: undefined, repoUrl: undefined, websiteUrl: undefined })} likeItemList={[]} setLikeItemList={jest.fn()} />);
    expect(screen.queryByRole('link', { name: 'Source code' })).not.toBeInTheDocument(); expect(screen.getByText(/documented implementation/)).toBeInTheDocument();
  });

  it('toggles and clears derived project filters', () => {
    const change = jest.fn(); const filters: ProjectFilters = { years: new Set(), tags: new Set() };
    const { rerender } = render(<ProjectFilter projects={[project(), project({ id: 2, date: '2024-01-01', tags: ['Vue'] }), project({ id: 3, date: 'unknown', tags: [] })]} filters={filters} onFiltersChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'React' })); expect(change).toHaveBeenCalledWith(expect.objectContaining({ tags: new Set(['React']) }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'React' })); fireEvent.mouseLeave(screen.getByRole('button', { name: 'React' })); expect(gsapTo).toHaveBeenCalledTimes(2);
    const active = { years: new Set(['2025']), tags: new Set(['React']) }; rerender(<ProjectFilter projects={[project()]} filters={active} onFiltersChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'React' })); expect(change).toHaveBeenLastCalledWith({ years: active.years, tags: new Set() }); fireEvent.click(screen.getByRole('button', { name: /Clear All/ })); expect(change).toHaveBeenLastCalledWith({ years: new Set(), tags: new Set() });
  });

  it('hydrates, reports, selects, and closes projects in the list', async () => {
    localStorage.setItem('portfolio-project:likes:project:1', '2'); const changes = jest.fn();
    render(<ProjectList projects={[project()]} onLikesChange={changes} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open case file for Alpha' })).toBeInTheDocument()); await waitFor(() => expect(changes).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Open case file for Alpha' })); expect(screen.getByRole('dialog')).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  });

  it('renders no project list for empty input', () => { const { container } = render(<ProjectList projects={[]} />); expect(container).toBeEmptyDOMElement(); });
});
