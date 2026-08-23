import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BlogFilter from '@/app/blog/components/BlogFitler';
import BlogPageClient from '@/app/blog/components/BlogPageClient';
import PopularPosts from '@/app/blog/components/PopularPosts';
import PostDetail from '@/app/blog/components/PostDetail';
import PostList from '@/app/blog/components/PostList';
import { TableOfContents } from '@/app/blog/components/TableOfContents';
import { trackEvent } from '@/components/AnalyticsEvent';
import type { PostDetailType, PostType } from '@/types/PostType';

let locale = 'en'; const gsapTo = jest.fn();
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: jest.fn() }));
jest.mock('@/lib/blogAction', () => ({ updateLike: jest.fn() }));
jest.mock('@/components/SectionWrapper', () => ({ children, title, ...props }: React.PropsWithChildren<{ title?: string }>) => <section {...props}>{title && <h1>{title}</h1>}{children}</section>);
jest.mock('@/components/LikeButton', () => ({ likeItem }: { likeItem: { title: string } }) => <button>Like {likeItem.title}</button>);
jest.mock('@/components/ShareButton', () => ({ title }: { title: string }) => <button>Share {title}</button>);
jest.mock('@/components/SaveButton', () => ({ title }: { title: string }) => <button>Save {title}</button>);
jest.mock('@/components/PostItem', () => ({ post }: { post: PostType }) => <article data-testid="post-item">{post.title}:{post.like}:{post.likesPerUser}</article>);
jest.mock('@/components/Tag', () => ({
  DisplayTag: ({ tag }: { tag: string }) => <span>{tag}</span>,
  FilterTag: ({ tag, handleOnChange, setRef, active }: { tag: string; handleOnChange: (tag: string) => void; setRef: (active: boolean) => void; active: boolean }) => <button aria-pressed={active} onClick={() => handleOnChange(tag)} onMouseEnter={() => setRef(true)} onMouseLeave={() => setRef(false)}>{tag}</button>,
}));
jest.mock('@/components/SortTabs', () => ({ __esModule: true, default: ({ sortBy, onChange }: { sortBy: string | null; onChange: (value: 'mostPopular' | 'newest' | 'oldest' | null) => void }) => <div><button onClick={() => onChange(sortBy === 'mostPopular' ? null : 'mostPopular')}>Popular</button><button onClick={() => onChange('newest')}>Newest</button><button onClick={() => onChange('oldest')}>Oldest</button></div> }));
jest.mock('gsap', () => ({ __esModule: true, default: { to: (...args: unknown[]) => gsapTo(...args) } }));
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, variants, initial, animate, whileHover, whileTap, ...props }: any) => React.createElement(tag, props, children); return { motion: new Proxy({}, { get: (_target, tag: string) => component(tag) }) }; });

const post = (id: number, title: string, date: string, like: number, tags: string[] = ['React']): PostType => ({ id, slug: [title.toLowerCase().replaceAll(' ', '-')], date, like, title, description: `${title} description`, image: `/${id}.png`, tags, headings: [], createdDate: new Date(date), createdLocaleDate: '', modifiedDate: new Date(date), readingTime: id });
const posts = [post(1, 'Old React', '2023-01-01', 3), post(2, 'New Art', '2025-01-01', 1, ['Art']), post(3, 'Popular React', '2024-01-01', 20), post(4, 'Fourth', '2022-01-01', 4, ['Other'])];
const detail = (overrides: Partial<PostDetailType> = {}): PostDetailType => ({ ...posts[2], headings: [{ title: 'Start', id: 'start', depth: 2 }, { title: 'Child', id: 'child', depth: 3 }, { title: 'Next root', id: 'next-root', depth: 2 }], content: <p>Article body</p>, ...overrides });

describe('blog browsing UI', () => {
  beforeEach(() => { locale = 'en'; localStorage.clear(); global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ likes: { 1: 8, 2: 2, 3: 30, 4: 5 } }) } as Response); window.history.replaceState(null, '', '/blog'); });

  it('derives, toggles, clears, and highlights blog filters', () => {
    const change = jest.fn(); const { rerender } = render(<BlogFilter posts={posts} selectedFilters={[]} onFiltersChange={change} />);
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['React', 'Art', 'Other']);
    fireEvent.click(screen.getByRole('button', { name: 'React' })); expect(change).toHaveBeenCalledWith(['React']);
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'React' })); fireEvent.mouseLeave(screen.getByRole('button', { name: 'React' })); expect(gsapTo).toHaveBeenCalledTimes(2);
    rerender(<BlogFilter posts={posts} selectedFilters={['React']} onFiltersChange={change} />); fireEvent.click(screen.getByRole('button', { name: 'React' })); expect(change).toHaveBeenLastCalledWith([]); fireEvent.click(screen.getByRole('button', { name: /Clear All/ })); expect(change).toHaveBeenLastCalledWith([]);
  });

  it('hydrates local and remote likes in the post list and changes sorting', async () => {
    localStorage.setItem('portfolio-project:likes:blog:1', '2'); const sort = jest.fn(); render(<PostList posts={posts.slice(0, 2)} sortBy={null} onSortChange={sort} />);
    await waitFor(() => expect(screen.getByText('Old React:8:2')).toBeInTheDocument()); fireEvent.click(screen.getByRole('button', { name: 'Popular' })); expect(sort).toHaveBeenCalledWith('mostPopular');
  });

  it('renders no list for empty posts', () => { const { container } = render(<PostList posts={[]} sortBy={null} onSortChange={jest.fn()} />); expect(container).toBeEmptyDOMElement(); });

  it('filters, sorts, paginates, synchronizes URLs, and localizes the blog client', async () => {
    const { rerender } = render(<BlogPageClient allPosts={posts} initialTags={['react']} limit={1} />);
    await waitFor(() => expect(screen.getByText(/Old React:8/)).toBeInTheDocument()); expect(window.location.pathname).toBe('/blog/react');
    fireEvent.click(screen.getByRole('button', { name: 'Popular' })); expect(screen.getByTestId('post-item')).toHaveTextContent('Popular React');
    fireEvent.click(screen.getByRole('button', { name: 'React' })); expect(window.location.pathname).toBe('/blog');
    fireEvent.click(screen.getByRole('button', { name: 'Newest' })); expect(screen.getByTestId('post-item')).toHaveTextContent('New Art');
    fireEvent.click(screen.getByRole('button', { name: '2' })); expect(screen.getByTestId('post-item')).toHaveTextContent('Popular React');
    locale = 'ja'; rerender(<BlogPageClient allPosts={posts} initialTags={[]} limit={2} />); await waitFor(() => expect(window.location.pathname).toBe('/ja/blog'));
    expect(screen.getByRole('heading', { name: 'ブログ' })).toBeInTheDocument();
  });

  it('ignores unknown initial tag segments and tolerates failed like fetching', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')); render(<BlogPageClient allPosts={posts} initialTags={['not-a-tag']} limit={10} />);
    await waitFor(() => expect(screen.getAllByTestId('post-item')).toHaveLength(4)); expect(window.location.pathname).toBe('/blog');
  });

  it('selects the top three popular posts without mutating locale links', () => {
    render(<PopularPosts posts={[...posts]} currentPostId={3} locale="ja" />);
    const links = screen.getAllByRole('link'); expect(links).toHaveLength(3); expect(links[0]).toHaveAttribute('href', '/ja/blog/post/fourth'); expect(screen.queryByText('Popular React')).not.toBeInTheDocument();
  });

  it('builds a heading tree, toggles branches and the complete TOC, and tracks active headings', () => {
    const article = detail(); const start = document.createElement('h2'); start.id = 'start'; start.getBoundingClientRect = () => ({ top: 50 } as DOMRect); document.body.append(start);
    render(<TableOfContents headings={article.headings} postItem={article} setPostItem={jest.fn()} />);
    expect(screen.getByRole('link', { name: 'Child' })).toHaveAttribute('href', '#child'); expect(screen.getByRole('link', { name: 'Start' })).toHaveClass('text-flame-500');
    const startToggle = screen.getByRole('link', { name: 'Start' }).parentElement!.querySelector('button')!; fireEvent.click(startToggle); expect(screen.queryByRole('link', { name: 'Child' })).not.toBeInTheDocument();
    const tocToggle = screen.getByText('On this page').parentElement!.querySelector('button')!; fireEvent.click(tocToggle); expect(screen.queryByRole('link', { name: 'Start' })).not.toBeInTheDocument();
  });

  it('omits an empty table of contents', () => { const { container } = render(<TableOfContents headings={[]} postItem={detail()} setPostItem={jest.fn()} />); expect(container).toBeEmptyDOMElement(); });

  it('hydrates post details, tracks reading, and renders related navigation', async () => {
    localStorage.setItem('portfolio-project:likes:blog:3', '4'); Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 }); Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 }); Object.defineProperty(window, 'scrollY', { configurable: true, value: 950 });
    render(<PostDetail post={detail()} posts={posts} />); await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'Popular React' })).toBeInTheDocument());
    expect(trackEvent).toHaveBeenCalledWith('post_view', 'Popular React'); fireEvent.scroll(window); expect(trackEvent).toHaveBeenCalledWith('reading_complete', 'Popular React');
    expect(screen.getByRole('navigation', { name: 'Related posts' })).toBeInTheDocument(); expect(screen.getByText('Article body')).toBeInTheDocument();
    expect(document.body).toHaveTextContent('3 min read');
  });

  it('localizes post metadata and omits unrelated navigation', async () => {
    locale = 'ja'; render(<PostDetail post={detail({ tags: ['Unique'] })} posts={posts} />); await waitFor(() => expect(document.body).toHaveTextContent('3分で読めます')); expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
