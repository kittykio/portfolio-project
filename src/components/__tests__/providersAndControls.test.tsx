import { fireEvent, render, screen } from '@testing-library/react';
import { trackEvent } from '@/components/AnalyticsEvent';
import { LocaleProvider, useLocale } from '@/components/LocaleContext';
import { MotionPreferenceProvider, MotionToggle, useMotionPreference } from '@/components/MotionPreference';
import ThemeContextProvider, { useThemeContext } from '@/components/ThemeContext';
import LanguageToggle from '@/components/header/LanguageToggle';
import ThemeToggle from '@/components/header/ThemeToggle';

let pathname = '/';
const push = jest.fn();
const setTheme = jest.fn();
let resolvedTheme = 'light';
jest.mock('next/navigation', () => ({ usePathname: () => pathname, useRouter: () => ({ push }) }));
jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme, theme: resolvedTheme, systemTheme: 'light', themes: ['light', 'dark'], setTheme, setThemes: jest.fn() }) }));
jest.mock('framer-motion', () => ({ MotionConfig: ({ children }: React.PropsWithChildren) => <>{children}</> }));

const LocaleConsumer = () => { const value = useLocale(); return <output>{value.locale}:{String(value.isJapanese)}</output>; };
const MotionConsumer = () => { const value = useMotionPreference(); return <output>{value.preference}:{String(value.shouldReduceMotion)}</output>; };
const ThemeConsumer = () => <output>{useThemeContext().resolvedTheme}</output>;

describe('providers and global controls', () => {
  beforeEach(() => { pathname = '/'; resolvedTheme = 'light'; localStorage.clear(); push.mockClear(); setTheme.mockClear(); });

  it('derives English and Japanese locale from the pathname', () => {
    const { rerender } = render(<LocaleProvider><LocaleConsumer /></LocaleProvider>);
    expect(screen.getByText('en:false')).toBeInTheDocument(); expect(document.documentElement.lang).toBe('en');
    pathname = '/ja/projects'; rerender(<LocaleProvider><LocaleConsumer /></LocaleProvider>);
    expect(screen.getByText('ja:true')).toBeInTheDocument(); expect(document.documentElement.lang).toBe('ja');
    pathname = '/ja'; rerender(<LocaleProvider><LocaleConsumer /></LocaleProvider>);
    expect(screen.getByText('ja:true')).toBeInTheDocument();
  });

  it('switches languages while preserving the route', () => {
    pathname = '/projects';
    const { rerender } = render(<LocaleProvider><LanguageToggle /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: '日本語に切り替える' }));
    expect(push).toHaveBeenCalledWith('/ja/projects');
    pathname = '/ja/projects'; rerender(<LocaleProvider><LanguageToggle /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(push).toHaveBeenCalledWith('/projects');
  });

  it('provides theme state and switches both theme directions', () => {
    const { rerender } = render(<ThemeContextProvider><ThemeConsumer /><ThemeToggle size={24} /></ThemeContextProvider>);
    expect(screen.getByText('light')).toBeInTheDocument(); fireEvent.click(screen.getByText('light').nextElementSibling!);
    expect(setTheme).toHaveBeenCalledWith('dark');
    resolvedTheme = 'dark'; rerender(<ThemeContextProvider><ThemeConsumer /><ThemeToggle /></ThemeContextProvider>);
    fireEvent.click(screen.getByText('dark').nextElementSibling!); expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('persists and toggles reduced motion', () => {
    const { rerender } = render(<LocaleProvider><MotionPreferenceProvider><MotionConsumer /><MotionToggle /></MotionPreferenceProvider></LocaleProvider>);
    expect(screen.getByText('system:false')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reduce motion' }));
    expect(screen.getByText('reduce:true')).toBeInTheDocument();
    expect(localStorage.getItem('kiki-motion-preference')).toBe('reduce');
    expect(document.documentElement.dataset.motion).toBe('reduce');
    fireEvent.click(screen.getByRole('button', { name: 'Reduce motion: on' }));
    expect(screen.getByText('system:false')).toBeInTheDocument();
    pathname = '/ja'; rerender(<LocaleProvider><MotionPreferenceProvider><MotionToggle compact /></MotionPreferenceProvider></LocaleProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('↝');
  });

  it('hydrates a stored reduced-motion preference', () => {
    localStorage.setItem('kiki-motion-preference', 'reduce');
    render(<MotionPreferenceProvider><MotionConsumer /></MotionPreferenceProvider>);
    expect(screen.getByText('reduce:true')).toBeInTheDocument();
  });

  it('sends localized analytics events', () => {
    const fetchMock = jest.fn().mockResolvedValue({} as Response);
    global.fetch = fetchMock;
    window.history.pushState({}, '', '/ja/blog'); trackEvent('share', 'Post');
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics', expect.objectContaining({ body: JSON.stringify({ name: 'share', label: 'Post', path: '/ja/blog', locale: 'ja' }) }));
    window.history.pushState({}, '', '/projects'); trackEvent('search');
    expect(fetchMock).toHaveBeenLastCalledWith('/api/analytics', expect.objectContaining({ body: expect.stringContaining('"locale":"en"') }));
  });
});
