import { act, fireEvent, render } from '@testing-library/react';
import { PixelTrailBackground } from '@/components/PixelTrailBackground';

it('builds a responsive pixel grid and colors random cells temporarily', () => {
  jest.useFakeTimers(); jest.spyOn(Math, 'random').mockReturnValue(0);
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 100 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
  const { container, unmount } = render(<PixelTrailBackground color="random" />);
  const cells = container.querySelectorAll('.transition-colors'); expect(cells.length).toBeGreaterThan(0);
  const cell = cells[0] as HTMLElement; fireEvent.mouseEnter(cell); expect(cell.style.backgroundColor).not.toBe('transparent');
  act(() => jest.advanceTimersByTime(300)); expect(cell.style.backgroundColor).toBe('transparent');
  fireEvent(window, new Event('resize')); unmount(); jest.restoreAllMocks(); jest.useRealTimers();
});
