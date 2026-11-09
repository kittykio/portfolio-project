import { fireEvent, render, screen } from '@testing-library/react';
import SortTabs from '@/components/SortTabs';

jest.mock('@/components/LocaleContext', () => ({ useLocale: jest.fn(() => ({ locale: 'en' })) }));

describe('SortTabs', () => {
  it('selects an inactive sort and clears the active sort', () => {
    const onChange = jest.fn();
    const { rerender } = render(<SortTabs sortBy={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Newest' }));
    expect(onChange).toHaveBeenLastCalledWith('newest');
    rerender(<SortTabs sortBy="newest" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Newest' }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('keeps the popular sort available as a labeled button group on narrow screens', () => {
    const onChange = jest.fn();
    const { rerender } = render(<SortTabs sortBy={null} onChange={onChange} />);
    const group = screen.getByRole('group', { name: 'Sort content' });
    const popularButton = screen.getByRole('button', { name: 'Most Popular' });

    expect(group).toHaveClass('overflow-x-auto');
    expect(popularButton).toHaveClass('shrink-0', 'whitespace-nowrap', 'min-h-11');
    fireEvent.click(popularButton);
    expect(onChange).toHaveBeenLastCalledWith('mostPopular');

    rerender(<SortTabs sortBy="mostPopular" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Most Popular' })).toHaveAttribute('aria-pressed', 'true');
  });
});
