import { act, fireEvent, render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/LoadingSpinner';

const setX = jest.fn(); const setY = jest.fn(); let valueCount = 0;
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, animate, transition, initial, ...props }: any) => React.createElement(tag, props, children); return { motion: new Proxy({}, { get: (_t, tag: string) => component(tag) }), useMotionValue: () => ({ set: valueCount++ % 2 ? setY : setX }), useSpring: (value: unknown) => value, useMotionTemplate: () => 'gradient' }; });

it('animates loading dots and tracks mouse and touch positions', () => {
  jest.useFakeTimers(); const { container, unmount } = render(<LoadingSpinner />);
  const root = container.firstElementChild as HTMLElement;
  jest.spyOn(root, 'getBoundingClientRect').mockReturnValue({ left: 10, top: 20 } as DOMRect);
  fireEvent.mouseMove(window, { clientX: 30, clientY: 50 }); expect(setX).toHaveBeenCalledWith(20); expect(setY).toHaveBeenCalledWith(30);
  fireEvent.touchMove(window, { touches: [{ clientX: 40, clientY: 60 }] }); expect(setX).toHaveBeenLastCalledWith(30);
  act(() => jest.advanceTimersByTime(400)); expect(screen.getByText('LOADING.')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1200)); expect(screen.getByText('LOADING')).toBeInTheDocument();
  unmount(); jest.useRealTimers();
});
