import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfettiParticles, circleDrawer, flakeDrawer, starDrawer, triangleDrawer } from '@/components/scroll-slider/ConfettiParticles';
import Sparkly from '@/components/Sparkly';
import SVGBezier from '@/components/SVGBezier';
import { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { getStyleFromHsl, getStyleFromRgb } from '@tsparticles/engine';
import type { IShapeDrawData, Particle } from '@tsparticles/engine';

const particlesRender = jest.fn();
jest.mock('@tsparticles/react', () => ({
  __esModule: true,
  default: (props: { id: string; options: unknown; particlesLoaded: (container: unknown) => Promise<void> }) => { particlesRender(props); void props.particlesLoaded({ id: props.id }); return <div data-testid="particles" />; },
  initParticlesEngine: jest.fn(),
}));
jest.mock('tsparticles', () => ({ loadFull: jest.fn() }));
jest.mock('@tsparticles/engine', () => ({ getStyleFromHsl: jest.fn(() => 'hsl-style'), getStyleFromRgb: jest.fn(() => 'rgb-style') }));
jest.mock('framer-motion', () => ({ motion: { span: ({ children, initial, animate, transition, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <span {...props}>{children}</span> } }));

const context = () => ({ save: jest.fn(), restore: jest.fn(), beginPath: jest.fn(), arc: jest.fn(), stroke: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(), closePath: jest.fn(), fill: jest.fn(), strokeStyle: '', fillStyle: '', lineWidth: 0 }) as unknown as CanvasRenderingContext2D;
const data = (fill: unknown, radius = 10): IShapeDrawData<Particle> =>
  ({ context: context(), radius, particle: { getFillColor: jest.fn(() => fill) } }) as unknown as IShapeDrawData<Particle>;

describe('visual effects', () => {
  beforeEach(() => { particlesRender.mockClear(); jest.mocked(initParticlesEngine).mockImplementation(async (callback) => { await callback({ addShape: jest.fn() } as never); }); jest.spyOn(console, 'log').mockImplementation(() => undefined); });

  it('draws all custom particle shapes and selects HSL/RGB/fallback strokes', () => {
    const circle = data(null); circleDrawer.draw!(circle); expect(circle.context.arc).toHaveBeenCalledTimes(2); expect(circle.context.strokeStyle).toBe('#ffffff');
    const star = data({ h: 1, s: 2, l: 3 }); starDrawer.draw!(star); expect(getStyleFromHsl).toHaveBeenCalled(); expect(star.context.lineTo).toHaveBeenCalledTimes(9); expect(star.context.closePath).toHaveBeenCalled();
    const triangle = data({ r: 1, g: 2, b: 3 }); triangleDrawer.draw!(triangle); expect(getStyleFromRgb).toHaveBeenCalled(); expect(triangle.context.closePath).toHaveBeenCalledTimes(2);
    const flake = data({ r: 1, g: 2, b: 3 }); flakeDrawer.draw!(flake); expect(flake.context.fill).toHaveBeenCalledTimes(6); expect(flake.context.stroke).toHaveBeenCalledTimes(12);
  });

  it('initializes the full particle engine, registers shapes, and renders configured fireworks', async () => {
    const addShape = jest.fn(); jest.mocked(initParticlesEngine).mockImplementation(async (callback) => { await callback({ addShape } as never); });
    render(<ConfettiParticles />); await waitFor(() => expect(screen.getByTestId('particles')).toBeInTheDocument());
    expect(loadFull).toHaveBeenCalled(); expect(addShape).toHaveBeenCalledTimes(4);
    const props = particlesRender.mock.calls[0][0]; expect(props.id).toBe('ts-firework'); expect(props.options.emitters.particles.shape.type).toBe('line'); expect(props.options.emitters.particles.destroy.split.particles.shape.type).toEqual(['customCircle', 'customStar', 'customTriangle', 'customFlake']);
  });

  it('reports particle initialization failures without rendering', async () => {
    jest.mocked(initParticlesEngine).mockRejectedValue(new Error('engine failed')); const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { container } = render(<ConfettiParticles />); await waitFor(() => expect(error).toHaveBeenCalledWith('Particles init failed', expect.any(Error))); expect(container).toBeEmptyDOMElement();
  });

  it('renders sparkles with deterministic color and creates replacements on its random interval', () => {
    jest.useFakeTimers(); jest.spyOn(Math, 'random').mockReturnValue(0.5);
    window.matchMedia = jest.fn(() => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as MediaQueryList));
    const { container, rerender } = render(<Sparkly color="hotpink">Magic</Sparkly>); expect(screen.getByText('Magic')).toBeInTheDocument(); expect(container.querySelectorAll('svg')).toHaveLength(3); expect(container.querySelector('path')).toHaveAttribute('fill', 'hotpink');
    act(() => jest.advanceTimersByTime(300)); expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(3);
    rerender(<Sparkly color="blue">Magic</Sparkly>); expect(container.querySelector('path')).toHaveAttribute('fill', 'blue'); jest.useRealTimers();
  });

  it('disables sparkle intervals for reduced motion', () => {
    window.matchMedia = jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as MediaQueryList));
    render(<Sparkly>Calm</Sparkly>); expect(screen.getByText('Calm')).toBeInTheDocument();
  });

  it('deforms and resets the responsive SVG bezier on pointer input', () => {
    const callbacks: FrameRequestCallback[] = []; global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => { callbacks.push(callback); return callbacks.length; }); global.cancelAnimationFrame = jest.fn();
    const { container, unmount } = render(<SVGBezier paddingY="py-8" svgHeight={120} />); const svg = container.querySelector('svg')!; const path = container.querySelector('path')!; const overlay = container.querySelector('[aria-hidden="true"]')!;
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 500, height: 120 } as DOMRect); fireEvent(window, new Event('resize')); expect(svg).toHaveAttribute('viewBox', '0 0 500 120');
    fireEvent(overlay, new MouseEvent('pointerdown', { bubbles: true, clientY: 10 })); fireEvent(overlay, new MouseEvent('pointermove', { bubbles: true, clientX: 250, clientY: 50 })); expect(path.getAttribute('d')).toContain('Q 250 84');
    fireEvent(overlay, new MouseEvent('pointerup', { bubbles: true })); expect(requestAnimationFrame).toHaveBeenCalled(); callbacks.shift()!(0); expect(path.getAttribute('d')).toContain('M0 60 Q');
    fireEvent(overlay, new MouseEvent('pointerdown', { bubbles: true, clientY: 20 })); expect(cancelAnimationFrame).toHaveBeenCalled(); fireEvent(overlay, new MouseEvent('pointerleave', { bubbles: true })); unmount();
  });
});
