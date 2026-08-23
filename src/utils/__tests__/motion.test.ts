import { fadeIn, slideIn, staggerContainer, textVariant, zoomIn } from '@/utils/motion';

describe('motion variants', () => {
  it('creates text and zoom variants with caller timing', () => {
    expect(textVariant(0.4)).toMatchObject({ hidden: { y: -50, opacity: 0 }, show: { y: 0, opacity: 1, transition: { delay: 0.4 } } });
    expect(zoomIn(0.2, 1.1)).toMatchObject({ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { delay: 0.2, duration: 1.1 } } });
  });

  it.each([
    ['left', { x: -100, y: 0 }], ['right', { x: 100, y: 0 }],
    ['up', { x: 0, y: 100 }], ['down', { x: 0, y: -100 }], ['none', { x: 0, y: 0 }],
  ] as const)('creates a %s fade offset', (direction, hidden) => {
    expect(fadeIn(direction).hidden).toEqual({ ...hidden, opacity: 0 });
  });

  it.each([
    ['left', { x: '-100%', y: 0 }], ['right', { x: '100%', y: 0 }],
    ['up', { x: 0, y: '100%' }], ['down', { x: 0, y: '-100%' }], ['none', { x: 0, y: 0 }],
  ] as const)('creates a %s slide offset', (direction, hidden) => {
    expect(slideIn(direction).hidden).toEqual(hidden);
  });

  it('configures stagger timing', () => {
    expect(staggerContainer(0.3, 0.5)).toEqual({ hidden: {}, show: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } } });
  });
});
