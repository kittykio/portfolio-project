import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from '@/components/Pagination';

describe('Pagination', () => {
  it('changes pages in client mode and disables the active page', () => {
    const onPageChange = jest.fn();
    render(<Pagination activePage={2} limit={10} total={35} mode="client" onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: '2' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: '«' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '»' })).toBeInTheDocument();
  });

  it('renders navigable URLs and marks the active link', () => {
    render(<Pagination activePage={1} limit={10} total={20} mode="url" pathname="/blog" />);
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/blog?page=1');
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders no controls when everything fits on one page', () => {
    const { container } = render(<Pagination activePage={1} limit={10} total={4} mode="client" />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });
});
