import { fireEvent, render, screen } from '@testing-library/react';
import ScrollSlider from './ScrollSlider';
jest.mock('./ConfettiParticles', () => ({ ConfettiParticles: () => <div>Confetti</div> }));

it('tracks, clamps, and cleans up scroll progress', () => {
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 1000 });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 500 });
  Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, writable: true, value: 450 });
  const remove = jest.spyOn(window, 'removeEventListener'); const { unmount } = render(<ScrollSlider><p>Page</p></ScrollSlider>);
  fireEvent.scroll(window); expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '90'); expect(screen.getByText('Confetti')).toBeInTheDocument();
  document.documentElement.scrollTop = 700; fireEvent.scroll(window); expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  unmount(); expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
});
