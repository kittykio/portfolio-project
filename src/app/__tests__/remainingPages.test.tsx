import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SavedPage from '@/app/saved/page';
import ResumePage from '@/app/resume/page';
import ContactPage from '@/app/contact/page';

let locale = 'en';
const trackEvent = jest.fn();
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: (...args: unknown[]) => trackEvent(...args) }));
jest.mock('@/components/SectionWrapper', () => ({ title, subtitle, children, className }: any) => <section className={className}><h1>{title}</h1><div>{subtitle}</div>{children}</section>);

describe('remaining application pages', () => {
  beforeEach(() => { locale = 'en'; localStorage.clear(); jest.clearAllMocks(); global.fetch = jest.fn(); });

  it('loads, validates, and displays saved projects and posts', async () => {
    localStorage.setItem('kiki-saved-project', JSON.stringify([{ id: 1, title: 'Good', href: '/projects/good' }, { title: 2, href: 'https://bad' }]));
    localStorage.setItem('kiki-saved-blog', '{bad json');
    render(<SavedPage />);
    expect(await screen.findByRole('link', { name: /Good/ })).toHaveAttribute('href', '/projects/good');
    expect(screen.getByText('1 saved items')).toBeInTheDocument();
    expect(localStorage.getItem('kiki-saved-blog')).toBeNull();
  });

  it('handles non-array saved values and renders empty guidance', async () => {
    localStorage.setItem('kiki-saved-project', '{}');
    render(<SavedPage />);
    expect(await screen.findByText('0 saved items')).toBeInTheDocument();
    expect(screen.getByText(/Save a project/)).toBeInTheDocument();
  });

  it('localizes and prints the resume', () => {
    const print = jest.fn(); Object.defineProperty(window, 'print', { configurable: true, value: print });
    const { rerender } = render(<ResumePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Download as PDF' })); expect(print).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Contact / Hire me' })).toHaveAttribute('href', '/contact');
    locale = 'ja'; rerender(<ResumePage />);
    expect(screen.getByRole('link', { name: '相談する' })).toHaveAttribute('href', '/ja/contact');
  });

  it('submits the contact form and resets it', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true }); render(<ContactPage />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'A website' } });
    fireEvent.change(inputs[1], { target: { value: 'Fall' } });
    fireEvent.change(inputs[2], { target: { value: '$5k' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'github' } });
    fireEvent.change(inputs[3], { target: { value: 'Enough project detail' } });
    fireEvent.change(inputs[4], { target: { value: 'me@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    await screen.findByText('Received — thank you!');
    expect(trackEvent).toHaveBeenCalledWith('contact_sent', 'A website');
    expect(inputs[0]).toHaveValue('');
  });

  it('shows localized contact errors', async () => {
    locale = 'ja'; (fetch as jest.Mock).mockRejectedValue(new Error('network')); render(<ContactPage />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'サイト' } }); fireEvent.change(inputs[3], { target: { value: '十分に長い相談内容です' } }); fireEvent.change(inputs[4], { target: { value: 'x@y.jp' } });
    fireEvent.click(screen.getByRole('button', { name: '相談を送る' }));
    await waitFor(() => expect(screen.getByText('もう一度試してください。')).toBeInTheDocument());
  });
});
