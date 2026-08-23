import { disperse, generateTransforms } from '@/utils/anim';

describe('animation helpers', () => {
  it('generates deterministic, bounded transforms', () => {
    const result = generateTransforms(4, 7);
    expect(result).toHaveLength(4);
    expect(result).toEqual(generateTransforms(4, 7));
    result.forEach(({ x, y, rotationZ }) => {
      expect(Math.hypot(x, y)).toBeLessThanOrEqual(0.801);
      expect(Math.abs(rotationZ)).toBeLessThanOrEqual(20);
    });
  });

  it('builds open and closed dispersion variants', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(disperse.open(1, 3)).toMatchObject({ x: '0em', y: '0em', rotateZ: 0, zIndex: 1 });
    expect(disperse.closed).toMatchObject({ x: '0em', y: '0em', rotateZ: 0, zIndex: 0 });
  });
});
