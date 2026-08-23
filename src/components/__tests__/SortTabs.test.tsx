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
});
