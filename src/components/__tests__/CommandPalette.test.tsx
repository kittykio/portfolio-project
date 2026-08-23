import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommandPalette from '@/components/CommandPalette';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale: 'en' }) }));

describe('CommandPalette', () => {
  beforeEach(() => { jest.clearAllMocks(); global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ projects: [{ label: 'Alpha project', href: '/projects/a', kind: 'Project' }], posts: [] }) }); });

  it('opens, searches remote and page content, navigates, and closes', async () => {
    render(<CommandPalette />); fireEvent.click(screen.getByRole('button', { name: 'Open command palette' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/search?locale=en'));
    const input = screen.getByPlaceholderText(/Search projects/);
    fireEvent.change(input, { target: { value: 'Alpha' } });
    fireEvent.click(await screen.findByRole('button', { name: /Alpha project/ }));
    expect(push).toHaveBeenCalledWith('/projects/a');
  });

  it('supports shortcuts, empty results, escape, and backdrop closing', () => {
    render(<CommandPalette />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    fireEvent.change(screen.getByPlaceholderText(/Search projects/), { target: { value: 'zzzz' } });
    expect(screen.getByText('No matching item.')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' }); expect(screen.getByRole('button', { name: 'Open command palette' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    fireEvent.mouseDown(screen.getByPlaceholderText(/Search projects/).parentElement!); expect(screen.getByPlaceholderText(/Search projects/)).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByPlaceholderText(/Search projects/).parentElement!.parentElement!);
    expect(screen.getByRole('button', { name: 'Open command palette' })).toBeInTheDocument();
  });
});
