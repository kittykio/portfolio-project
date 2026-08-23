import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CatLogo from '@/components/CatLogo';
import Error404 from '@/components/Error404';
import Error500 from '@/components/Error500';
import FilterWrapper from '@/components/FilterWrapper';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import PushableButton from '@/components/PushableButton';
import SavedLink from '@/components/SavedLink';
import ShareButton from '@/components/ShareButton';
import Footer from '@/components/footer/Footer';

let locale = 'en';
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/Magnetic', () => ({ Magnetic: ({ children }: React.PropsWithChildren) => <>{children}</>, FramerMagnetic: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('@/components/DisperseText', () => ({ children }: React.PropsWithChildren) => <>{children}</>);
jest.mock('@/components/PixelTrailBackground', () => ({ PixelTrailBackground: () => <div data-testid="pixels" /> }));
jest.mock('@/components/SectionWrapper', () => ({ children, ...props }: React.PropsWithChildren) => <section {...props}>{children}</section>);
jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: jest.fn() }));
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, variants, initial, animate, whileHover, whileTap, ...props }: any) => React.createElement(tag, props, children); return { motion: new Proxy({}, { get: (_t, tag: string) => component(tag) }) }; });

describe('shared shell basics', () => {
  beforeEach(() => { locale = 'en'; });

  it('renders branded and saved links', () => {
    render(<><div style={{ width: 20, height: 20 }}><CatLogo className="brand" /></div><SavedLink /></>);
    expect(screen.getByRole('img', { name: /Kitty Kio cat logo/ })).toHaveClass('brand');
    expect(screen.getByRole('link', { name: /Saved/ })).toHaveAttribute('href', '/saved');
  });

  it('renders error recovery states and updates document titles', () => {
    const reset = jest.fn(); const { unmount } = render(<Error404 />);
    expect(screen.getByText('404')).toBeInTheDocument(); expect(document.title).toBe('404 — Page Not Found');
    expect(screen.getByRole('link', { name: 'Go Back Home' })).toHaveAttribute('href', '/'); unmount();
    render(<Error500 reset={reset} />); fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(reset).toHaveBeenCalled(); expect(document.title).toBe('500 — Something Went Wrong');
  });

  it('supports a missing error reset callback', () => {
    render(<Error500 />); expect(() => fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))).not.toThrow();
  });

  it('shows and hides filter clearing and attaches the overlay ref', () => {
    const clear = jest.fn(); const background = { current: document.createElement('div') };
    const { rerender } = render(<FilterWrapper onClearAll={clear} showClear background={background}><span>Filters</span></FilterWrapper>);
    fireEvent.click(screen.getByRole('button', { name: /Clear All/ })); expect(clear).toHaveBeenCalled(); expect(background.current).toBeInstanceOf(HTMLDivElement);
    rerender(<FilterWrapper onClearAll={clear} showClear={false} background={background}><span>Filters</span></FilterWrapper>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders eight skeleton cards', () => {
    const { container } = render(<LoadingSkeleton />); expect(container.querySelectorAll('.animate-pulse')).toHaveLength(10);
  });

  it.each(['heart', 'moon', 'sun'] as const)('renders and activates a %s pushable button', (shape) => {
    const click = jest.fn(); const { container } = render(<PushableButton shape={shape} size={32} onClick={click}>Go</PushableButton>);
    fireEvent.click(screen.getByRole('button')); expect(click).toHaveBeenCalled(); expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the complete localized footer navigation', () => {
    const { rerender } = render(<Footer />);
    expect(screen.getByText('Thoughtful code can be useful, expressive, and a little bit magical.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    locale = 'ja'; rerender(<Footer />);
    expect(screen.getByRole('link', { name: 'プロジェクト' })).toHaveAttribute('href', '/ja/projects');
    expect(screen.getByText(/コードは MIT ライセンス/)).toBeInTheDocument();
  });

  it('uses native sharing when available and falls back otherwise', async () => {
    const share = jest.fn().mockResolvedValue(undefined); Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    const { rerender } = render(<ShareButton title="Work" />); fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect(share).toHaveBeenCalled();
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    const writeText = jest.fn().mockResolvedValue(undefined); Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    rerender(<ShareButton title="Work" />); fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
