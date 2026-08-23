import { fireEvent, render, screen } from '@testing-library/react';
import Newsletter from '@/components/footer/Newsletter';
import Socials from '@/components/footer/Socials';

const tweenFromTo = jest.fn(); const play = jest.fn(); const to = jest.fn();
jest.mock('@/components/Magnetic', () => ({ Magnetic: ({ children }: React.PropsWithChildren) => <>{children}</>, FramerMagnetic: ({ children }: React.PropsWithChildren) => <>{children}</> }));
jest.mock('gsap', () => ({ __esModule: true, default: { timeline: () => ({ to: (...args: unknown[]) => { to(...args); return { to: (...next: unknown[]) => { to(...next); return { tweenFromTo, play }; }, tweenFromTo, play }; }, tweenFromTo, play }) } }));

describe('newsletter interactions', () => {
  beforeEach(() => { jest.clearAllMocks(); jest.spyOn(window, 'alert').mockImplementation(() => {}); jest.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => { jest.restoreAllMocks(); });

  it('validates and subscribes an email while exercising the animated button', () => {
    jest.useFakeTimers(); render(<Newsletter />);
    const button = screen.getByRole('button', { name: 'Subscribe' });
    fireEvent.click(button); expect(window.alert).toHaveBeenCalledWith('Please enter your email address!');
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'hello@example.com' } });
    fireEvent.mouseEnter(button); expect(tweenFromTo).toHaveBeenCalledWith('enter', 'exit');
    fireEvent.mouseLeave(button); jest.advanceTimersByTime(300); expect(play).toHaveBeenCalled();
    fireEvent.click(button); expect(window.alert).toHaveBeenCalledWith('Subscribed with: hello@example.com');
    expect(screen.getByLabelText('Email address')).toHaveValue(''); jest.useRealTimers();
  });

  it('renders the public social destinations', () => {
    render(<Socials />); const links = screen.getAllByRole('link'); expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
