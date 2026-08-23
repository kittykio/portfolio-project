import { act, fireEvent, render, screen } from '@testing-library/react';
import HeroSection from '@/app/components/HeroSection';
import IntroSection from '@/app/components/IntroSection';
import ExperienceSection from '@/app/components/ExperienceSection';
import GetToKnowMeSection from '@/app/components/GetToKnowMeSection';
import InterestSection from '@/app/components/interest-section/InterestSection';
import gsap from 'gsap';

let locale = 'en';
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale, isJapanese: locale === 'ja' }) }));
jest.mock('@/components/SectionWrapper', () => ({ children, title, subtitle, ...props }: React.PropsWithChildren<{ title?: string; subtitle?: string }>) => <section {...props}>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}{children}</section>);
jest.mock('@/components/DisperseText', () => ({ children }: React.PropsWithChildren) => <span>{children}</span>);
jest.mock('@/components/PixelTrailBackground', () => ({ PixelTrailBackground: () => <div data-testid="pixel-trail" /> }));
jest.mock('@/components/CardFloatWrapper', () => ({ Card: ({ children }: React.PropsWithChildren) => <article>{children}</article>, CardFloatWrapper: ({ children }: React.PropsWithChildren) => <div>{children}</div> }));
jest.mock('@/components/Tag', () => ({ DisplayTag: ({ title }: { title: string }) => <span>{title}</span> }));
jest.mock('gsap', () => ({ __esModule: true, default: { registerPlugin: jest.fn(), to: jest.fn() } }));
jest.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
jest.mock('framer-motion', () => {
  const React = require('react');
  const component = (tag: string) => React.forwardRef(({ children, whileInView, initial, animate, exit, transition, variants, ...props }: any, ref: any) => React.createElement(tag, { ...props, ref }, children));
  const motion = new Proxy({}, { get: (_target, tag: string) => component(tag) });
  return { motion, m: motion, LazyMotion: ({ children }: any) => children, domAnimation: {}, AnimatePresence: ({ children }: any) => children, useScroll: () => ({ scrollYProgress: 0 }), useTransform: () => 0, useMotionTemplate: () => 'inset(0 0% 0 0)' };
});

describe('home page sections', () => {
  beforeEach(() => { locale = 'en'; });

  it('renders and localizes the hero', () => {
    const { rerender } = render(<HeroSection />);
    expect(screen.getByRole('heading', { name: 'Hi, I’m Kiki!' })).toBeInTheDocument();
    expect(screen.getByTestId('pixel-trail')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#what-i-make');
    locale = 'ja'; rerender(<HeroSection />);
    expect(screen.getByRole('heading', { name: 'kiki です、よろしくね！' })).toBeInTheDocument();
  });

  it('splits intro copy into animated letters and registers its scroll animation', () => {
    const { container, rerender } = render(<IntroSection />);
    expect(container.querySelectorAll('.opacity-20').length).toBeGreaterThan(100);
    expect(gsap.to).toHaveBeenCalled();
    locale = 'ja'; rerender(<IntroSection />);
    expect(container.textContent).toContain('Kikiは');
  });

  it('renders the full experience timeline in both locales', () => {
    const { rerender } = render(<ExperienceSection />);
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    locale = 'ja'; rerender(<ExperienceSection />);
    expect(screen.getByRole('heading', { name: '経験' })).toBeInTheDocument();
  });

  it('renders and advances the get-to-know-me cards', () => {
    jest.useFakeTimers();
    const { rerender } = render(<GetToKnowMeSection />);
    expect(screen.getByText('Facts')).toBeInTheDocument();
    expect(screen.getByText('Developer skills')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(4000));
    locale = 'ja'; rerender(<GetToKnowMeSection />);
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('opens mobile interests and handles desktop hover selection', () => {
    render(<InterestSection />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getAllByText(/Design systems, responsive UI/).length).toBeGreaterThan(0);
    const title = screen.getAllByText('Creative Code')[0];
    const wrapper = title.parentElement!;
    fireEvent.mouseOver(wrapper);
    fireEvent.mouseLeave(wrapper);
  });
});
