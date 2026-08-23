import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AskKiki from '@/components/AskKiki';

let locale = 'en';
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('framer-motion', () => { const React = require('react'); const component = (tag: string) => ({ children, initial, animate, exit, ...props }: any) => React.createElement(tag, props, children); return { motion: new Proxy({}, { get: (_t, tag: string) => component(tag) }), AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</> }; });

describe('AskKiki', () => {
  const original = process.env.NEXT_PUBLIC_ASK_KIKI_ENABLED;
  beforeEach(() => { locale = 'en'; process.env.NEXT_PUBLIC_ASK_KIKI_ENABLED = 'true'; global.fetch = jest.fn(); });
  afterAll(() => { process.env.NEXT_PUBLIC_ASK_KIKI_ENABLED = original; });

  it('opens, asks a question, renders answer links, and closes', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ answer: 'See [Work](/projects).' }) });
    render(<AskKiki />); fireEvent.click(screen.getByRole('button', { name: 'Ask Kiki' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'What?' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Ask' })[1]);
    await waitFor(() => expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/projects'));
    expect(fetch).toHaveBeenCalledWith('/api/ask-kiki', expect.objectContaining({ method: 'POST' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' })); expect(screen.queryByText(/Request what/)).not.toBeInTheDocument();
  });

  it('submits project and article requests and resets fields', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    render(<AskKiki />); fireEvent.click(screen.getByRole('button', { name: 'Ask Kiki' }));
    fireEvent.click(screen.getByRole('button', { name: 'Request a project' }));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New app' } });
    fireEvent.change(screen.getByPlaceholderText('Email (optional)'), { target: { value: 'a@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Tell me/), { target: { value: 'Please build this useful project' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send request' }));
    await waitFor(() => expect(screen.getByText(/Request received/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Request an article' }));
    expect(screen.getByPlaceholderText('Title')).toHaveValue('');
  });

  it('shows errors, disabled copy, and Japanese copy', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    const { unmount } = render(<AskKiki />); fireEvent.click(screen.getByRole('button', { name: 'Ask Kiki' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'fail' } }); fireEvent.click(screen.getAllByRole('button', { name: 'Ask' })[1]);
    await screen.findByText('Please try again.'); unmount();
    process.env.NEXT_PUBLIC_ASK_KIKI_ENABLED = 'false'; locale = 'ja'; render(<AskKiki />);
    fireEvent.click(screen.getByRole('button', { name: 'Kikiに聞く' })); expect(screen.getByText('Ask Kikiは準備中です')).toBeInTheDocument();
  });
});
