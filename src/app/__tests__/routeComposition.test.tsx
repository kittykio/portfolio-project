import { act, render, screen } from '@testing-library/react';
import GlobalError from '@/app/error';
import NotFound from '@/app/not-found';
import AppLoading from '@/app/loading';
import BlogLoading from '@/app/blog/loading';
import ProjectsLoading from '@/app/projects/loading';
import PostLoading from '@/app/blog/post/[...slug]/loading';
import BlogLayout from '@/app/blog/layout';
import ProjectsLayout from '@/app/projects/layout';
import AboutPage from '@/app/about-this-app/page';
import JapaneseAboutPage from '@/app/ja/about-this-app/page';
import ProjectsPage from '@/app/projects/page';
import JapaneseProjectsPage from '@/app/ja/projects/page';
import HomePage from '@/app/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import JapaneseContact from '@/app/ja/contact/page';
import JapaneseResume from '@/app/ja/resume/page';
import JapaneseSaved from '@/app/ja/saved/page';
import JapaneseLab from '@/app/ja/lab/page';
import JapaneseNow from '@/app/ja/now/page';
import Now from '@/app/now/page';

const getAllPosts = jest.fn().mockResolvedValue([{ slug: ['hello'], modifiedDate: new Date('2025-01-01') }]);
const getAllProjects = jest.fn().mockResolvedValue([{ slug: 'work', modifiedDate: new Date('2025-02-01') }]);
jest.mock('@/lib/blogApi', () => ({ getAllPosts: (...args: unknown[]) => getAllPosts(...args) }));
jest.mock('@/lib/projectApi', () => ({ getAllProjects: (...args: unknown[]) => getAllProjects(...args) }));
jest.mock('@/i18n/server', () => ({ getRequestLocale: () => 'en' }));
jest.mock('@/components/LoadingSpinner', () => () => <div>Spinner</div>);
jest.mock('@/components/LoadingSkeleton', () => () => <div>Skeleton</div>);
jest.mock('@/components/Error404', () => () => <div>Missing</div>);
jest.mock('@/components/Error500', () => ({ reset }: { reset: () => void }) => <button onClick={reset}>Failed</button>);
jest.mock('@/app/about-this-app/AboutThisAppContent', () => ({ locale }: { locale: string }) => <div>About {locale}</div>);
jest.mock('@/app/projects/components/ProjectPageClient', () => ({ initialProjects }: { initialProjects: unknown[] }) => <div>Projects {initialProjects.length}</div>);
jest.mock('@/app/components/HeroSection', () => () => <div>Hero</div>);
jest.mock('@/app/components/IntroSection', () => () => <div>Intro</div>);
jest.mock('@/app/components/interest-section/InterestSection', () => () => <div>Interests</div>);
jest.mock('@/app/components/GetToKnowMeSection', () => () => <div>Know</div>);
jest.mock('@/app/components/ProjectSection', () => ({ projects }: { projects: unknown[] }) => <div>Home projects {projects.length}</div>);
jest.mock('@/app/components/BlogSection', () => ({ posts }: { posts: unknown[] }) => <div>Home posts {posts.length}</div>);
jest.mock('@/app/components/ExperienceSection', () => () => <div>Experience</div>);
jest.mock('@/app/lab/page', () => () => <div>Lab route</div>);
jest.mock('@/app/contact/page', () => () => <div>Contact route</div>);
jest.mock('@/app/resume/page', () => () => <div>Resume route</div>);
jest.mock('@/app/saved/page', () => () => <div>Saved route</div>);

describe('route composition', () => {
  it('renders error boundaries before and after their delay', () => {
    jest.useFakeTimers(); const reset = jest.fn(); const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<GlobalError error={new Error('boom')} reset={reset} />); expect(screen.getByText('Spinner')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(500)); expect(screen.getByText('Failed')).toBeInTheDocument();
    rerender(<NotFound />); act(() => jest.advanceTimersByTime(500)); expect(screen.getByText('Missing')).toBeInTheDocument();
    spy.mockRestore(); jest.useRealTimers();
  });

  it('renders loaders and layouts', () => {
    render(<><AppLoading /><BlogLoading /><ProjectsLoading /><PostLoading /><BlogLayout><b>Blog child</b></BlogLayout><ProjectsLayout><b>Project child</b></ProjectsLayout></>);
    expect(screen.getAllByText(/Spinner|Skeleton/)).toHaveLength(4); expect(screen.getByText('Blog child')).toBeInTheDocument();
  });

  it('renders localized about routes', () => {
    render(<><AboutPage /><JapaneseAboutPage /></>); expect(screen.getByText('About en')).toBeInTheDocument(); expect(screen.getByText('About ja')).toBeInTheDocument();
  });

  it('loads project and home route data', async () => {
    render(<>{await ProjectsPage()}{await JapaneseProjectsPage()}{await HomePage()}</>);
    expect(screen.getAllByText('Projects 1')).toHaveLength(2); expect(screen.getByText('Home posts 1')).toBeInTheDocument();
    expect(getAllProjects).toHaveBeenCalledWith('ja');
  });

  it('builds robots and sitemap metadata', async () => {
    expect(robots().sitemap).toContain('/sitemap.xml');
    const entries = await sitemap(); expect(entries).toHaveLength(9);
    expect(entries.some(entry => entry.url.endsWith('/blog/post/hello'))).toBe(true);
    expect(entries.some(entry => entry.url.endsWith('/projects/work'))).toBe(true);
  });

  it('composes language-prefixed route aliases', () => {
    render(<><JapaneseContact /><JapaneseResume /><JapaneseSaved /><JapaneseLab /><JapaneseNow /><Now /></>);
    expect(screen.getByText('Contact route')).toBeInTheDocument(); expect(screen.getAllByText('Lab route')).toHaveLength(3);
  });
});
