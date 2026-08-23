import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DisperseText from '@/components/DisperseText';
import { LogoCircle, LogoFill, LogoOutline } from '@/components/Logo';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import { Magnetic, FramerMagnetic } from '@/components/Magnetic';
import SectionWrapper from '@/components/SectionWrapper';
import { DisplayTag, FilterTag } from '@/components/Tag';

const start = jest.fn().mockResolvedValue(undefined);
let inView = true;
const quickX = jest.fn();
const quickY = jest.fn();

jest.mock('react-parallax-tilt', () => ({ children, className }: React.PropsWithChildren<{ className?: string }>) => <div data-testid="tilt" className={className}>{children}</div>);
jest.mock('gsap', () => ({ __esModule: true, default: { quickTo: (_el: Element, property: string) => property === 'x' ? quickX : quickY } }));
jest.mock('framer-motion', () => {
  const React = require('react');
  const component = (tag: string) => React.forwardRef(({ children, variants, animate, initial, whileInView, viewport, transition, custom, ...props }: any, ref: any) => React.createElement(tag, { ...props, ref, 'data-animate': typeof animate === 'string' ? animate : JSON.stringify(animate) }, children));
  const proxy = new Proxy({}, { get: (_target, tag: string) => component(tag) });
  return { motion: proxy, m: proxy, LazyMotion: ({ children }: React.PropsWithChildren) => <>{children}</>, domAnimation: {}, useAnimation: () => ({ start }), useInView: () => inView };
});

describe('remaining shared primitives', () => {
  beforeEach(() => { jest.clearAllMocks(); inView = true; });

  it('disperses nested text and reports hover state', () => {
    const setRef = jest.fn();
    const { container, rerender } = render(<DisperseText setRef={setRef} bounce>Hi <strong>2</strong></DisperseText>);
    const wrapper = container.firstElementChild!;
    expect(wrapper.querySelectorAll('span')).toHaveLength(4);
    fireEvent.mouseEnter(wrapper); expect(setRef).toHaveBeenCalledWith(true);
    expect(wrapper.querySelector('span')).toHaveAttribute('data-animate', 'open');
    fireEvent.mouseLeave(wrapper); expect(setRef).toHaveBeenCalledWith(false);
    rerender(<DisperseText>Ok</DisperseText>);
    expect(container.querySelector('span span')).toHaveAttribute('data-animate', 'closed');
  });

  it('renders every logo variant', () => {
    const { container } = render(<><LogoOutline /><LogoFill /><LogoCircle /></>);
    expect(container.querySelectorAll('svg')).toHaveLength(3);
    expect(container.querySelectorAll('path')).toHaveLength(19);
  });

  it('animates cards in and out of view and supports optional tilt styling', async () => {
    const { rerender } = render(<CardFloatWrapper index={2} className="float"><Card rounded className="card">content</Card></CardFloatWrapper>);
    expect(screen.getByTestId('tilt')).toBeInTheDocument();
    await waitFor(() => expect(start).toHaveBeenCalledWith(expect.objectContaining({ y: [0, -12, 0] })));
    inView = false;
    rerender(<CardFloatWrapper tilt={false}>plain</CardFloatWrapper>);
    await waitFor(() => expect(start).toHaveBeenCalledWith(expect.objectContaining({ y: 0 })));
    expect(screen.getByText('plain')).toBeInTheDocument();
  });

  it('applies and resets both magnetic effects', () => {
    const rect = { width: 100, height: 80, left: 10, top: 20, right: 110, bottom: 100, x: 10, y: 20, toJSON: () => ({}) };
    const first = render(<Magnetic><span>GSAP</span></Magnetic>);
    const el = screen.getByText('GSAP').parentElement!;
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);
    fireEvent.mouseMove(el, { clientX: 80, clientY: 70 });
    expect(quickX).toHaveBeenCalledWith(7); expect(quickY).toHaveBeenCalledWith(3.5);
    fireEvent.mouseLeave(el); expect(quickX).toHaveBeenLastCalledWith(0);
    first.unmount();
    render(<FramerMagnetic><span>Framer</span></FramerMagnetic>);
    const motionEl = screen.getByText('Framer').parentElement!;
    jest.spyOn(motionEl, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);
    fireEvent.mouseMove(motionEl, { clientX: 80, clientY: 70 });
    fireEvent.mouseLeave(motionEl); expect(motionEl).toHaveAttribute('data-animate', JSON.stringify({ x: 0, y: 0 }));
  });

  it('renders section header combinations and tag interactions', () => {
    const change = jest.fn(); const hover = jest.fn();
    const { rerender } = render(<SectionWrapper title="My Section" subtitle={<em>Sub</em>}><p>Body</p></SectionWrapper>);
    expect(screen.getByText('Body').parentElement).toHaveAttribute('id', 'my-section');
    rerender(<><SectionWrapper className="custom"><p>Only body</p></SectionWrapper><FilterTag i={1} tag="React" active handleOnChange={change} setRef={hover} /><DisplayTag tag="TypeScript" /></>);
    const tag = screen.getByRole('button', { name: '#React' });
    fireEvent.mouseEnter(tag); fireEvent.click(tag); fireEvent.mouseLeave(tag);
    expect(change).toHaveBeenCalledWith('React'); expect(hover.mock.calls).toEqual([[true], [false]]);
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
  });
});
