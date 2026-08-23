import { act, fireEvent, render, screen } from '@testing-library/react';
import LabPage from '@/app/lab/page';

let locale = 'en'; let theme = 'light'; let reduceMotion = false; let articleProps: Record<string, any> = {};
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/ThemeContext', () => ({ useThemeContext: () => ({ resolvedTheme: theme }) }));
jest.mock('@/components/MotionPreference', () => ({ useMotionPreference: () => ({ shouldReduceMotion: reduceMotion }) }));
jest.mock('@/components/SectionWrapper', () => ({ children, title, subtitle }: React.PropsWithChildren<{ title: string; subtitle: string }>) => <main><h1>{title}</h1><p>{subtitle}</p>{children}</main>);
jest.mock('@/app/lab/components/LabHero', () => (props: { paused: boolean; performanceMode: string; eyebrow: string }) => <div data-testid="lab-hero" data-paused={props.paused} data-performance={props.performanceMode}>{props.eyebrow}</div>);
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, initial, whileInView, viewport, transition, variants, animate, exit, custom, dragConstraints, dragElastic, ...props }: any) => { if (tag === 'article' && props.onDragEnd) articleProps = props; return React.createElement(tag, props, children); }; return { motion: new Proxy({}, { get: (_target, tag: string) => component(tag) }), AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</> }; });

describe('LabPage', () => {
  beforeEach(() => { locale = 'en'; theme = 'light'; reduceMotion = false; articleProps = {}; Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 8 }); Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 }); Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false } }); });

  it('renders English status, performance summary, carousel, and notes', () => {
    render(<LabPage />); expect(screen.getByRole('heading', { level: 1, name: 'Now' })).toBeInTheDocument(); expect(screen.getByText('Building')).toBeInTheDocument(); expect(screen.getByText('Standard scene (up to 1.5× DPR)')).toBeInTheDocument(); expect(screen.getByText('Building a calmer portfolio')).toBeInTheDocument(); expect(screen.getByText('Motion with purpose')).toBeInTheDocument(); expect(screen.getByTestId('lab-hero')).toHaveAttribute('data-paused', 'false');
  });

  it('moves in both directions, selects a slide, pauses, resumes, and handles drag thresholds', () => {
    jest.useFakeTimers(); render(<LabPage />); fireEvent.click(screen.getByRole('button', { name: 'Next experiment' })); expect(screen.getByText('Making motion feel useful')).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'Previous experiment' })); expect(screen.getByText('Building a calmer portfolio')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Writing across languages' })); expect(screen.getByText('Writing across languages')).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'Pause motion' })); expect(screen.getByRole('button', { name: 'Resume motion' })).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'Resume motion' }));
    act(() => articleProps.onDragStart()); act(() => articleProps.onDragEnd({}, { offset: { x: -100 }, velocity: { x: 0 } })); expect(screen.getByText('Protecting the performance budget')).toBeInTheDocument(); act(() => articleProps.onDragEnd({}, { offset: { x: 100 }, velocity: { x: 0 } })); expect(screen.getByText('Writing across languages')).toBeInTheDocument(); jest.useRealTimers();
  });

  it('auto-advances unless motion is reduced', () => {
    jest.useFakeTimers(); const { rerender } = render(<LabPage />); act(() => jest.advanceTimersByTime(4500)); expect(screen.getByText('Making motion feel useful')).toBeInTheDocument(); reduceMotion = true; rerender(<LabPage />); act(() => jest.advanceTimersByTime(9000)); expect(screen.getByText('Making motion feel useful')).toBeInTheDocument(); expect(screen.getByTestId('lab-hero')).toHaveAttribute('data-paused', 'true'); jest.useRealTimers();
  });

  it('selects lightweight mode for constrained devices and localizes Japanese content', () => {
    locale = 'ja'; theme = 'dark'; reduceMotion = true; Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 2 }); const { rerender } = render(<LabPage />); expect(screen.getByRole('heading', { name: 'いま' })).toBeInTheDocument(); expect(screen.getByText('軽量シーン（DPR 1×）')).toBeInTheDocument(); expect(screen.getByText('ダーク')).toBeInTheDocument(); expect(screen.getByText('より落ち着いたポートフォリオをつくる')).toBeInTheDocument();
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 8 }); Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }); rerender(<LabPage />); expect(screen.getByTestId('lab-hero')).toHaveAttribute('data-performance', 'light');
  });
});
