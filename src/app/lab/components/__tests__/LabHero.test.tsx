import { render, screen } from '@testing-library/react';
import LabHero from '@/app/lab/components/LabHero';

let theme = 'light'; const frames: Array<(state: { clock: { elapsedTime: number } }, delta: number) => void> = []; const canvasProps = jest.fn();
jest.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: theme }) }));
jest.mock('@react-three/fiber', () => ({ Canvas: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => { canvasProps(props); return <div data-testid="canvas">{children}</div>; }, useFrame: (callback: (state: { clock: { elapsedTime: number } }, delta: number) => void) => frames.push(callback) }));
jest.mock('@react-three/drei', () => { const React = require('react'); const component = React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>); return { Cloud: component, Clouds: component, OrbitControls: component, Sky: component, Stars: component }; });
jest.mock('leva', () => ({ Leva: () => <div data-testid="leva" />, useControls: (_name: string, config: Record<string, unknown>) => Object.fromEntries(Object.entries(config).map(([key, value]) => [key, typeof value === 'object' && value !== null && 'value' in value ? (value as { value: unknown }).value : value])) }));
jest.mock('three', () => ({ MeshLambertMaterial: 'lambert', MeshBasicMaterial: 'basic' }));
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, initial, animate, transition, variants, ...props }: any) => React.createElement(tag, props, children); const m = new Proxy({}, { get: (_target, tag: string) => component(tag) }); return { m, LazyMotion: ({ children }: React.PropsWithChildren) => <>{children}</>, domAnimation: {} }; });

describe('LabHero', () => {
  beforeEach(() => { theme = 'light'; frames.length = 0; canvasProps.mockClear(); });

  it('renders the light scene, custom copy, standard DPR, and animated name', () => {
    render(<LabHero eyebrow="Right now" description="Making things" />);
    expect(screen.getByText('Right now')).toBeInTheDocument(); expect(screen.getByText('Making things')).toBeInTheDocument(); expect(screen.getAllByText('k', { selector: 'span' })).toHaveLength(2); expect(screen.getByTestId('leva')).toBeInTheDocument();
    expect(canvasProps).toHaveBeenCalledWith(expect.objectContaining({ frameloop: 'always', dpr: [1, 1.5], camera: { position: [0, -10, 10], fov: 75 } })); expect(frames).toHaveLength(1);
  });

  it('renders the dark lightweight paused scene and advances its frame callback', () => {
    theme = 'dark'; const { container } = render(<LabHero paused performanceMode="light" />);
    expect(canvasProps).toHaveBeenCalledWith(expect.objectContaining({ frameloop: 'never', dpr: 1, camera: { position: [0, 1, 5], fov: 50 } })); expect(frames).toHaveLength(1); expect(container.querySelector('[style*="background-color"]')).not.toBeInTheDocument();
  });
});
