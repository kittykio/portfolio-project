import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Header from '@/components/header/Header';

let locale = 'en'; let theme = 'light';
jest.mock('@/components/LocaleContext', () => ({ useLocale: () => ({ locale }) }));
jest.mock('@/components/ThemeContext', () => ({ useThemeContext: () => ({ resolvedTheme: theme }) }));
jest.mock('@/components/header/ThemeToggle', () => ({ size }: { size: number }) => <button>Theme {size}</button>);
jest.mock('@/components/header/LanguageToggle', () => () => <button>Language</button>);
jest.mock('@/components/MotionPreference', () => ({ MotionToggle: ({ compact }: { compact?: boolean }) => <button>Motion {compact ? 'compact' : 'full'}</button> }));
jest.mock('@/components/CommandPalette', () => () => <button>Commands</button>);
jest.mock('@/components/SavedLink', () => () => <a href="/saved">Saved</a>);
jest.mock('@/components/CatLogo', () => () => <img alt="Cat" />);
jest.mock('framer-motion', () => ({ motion: { nav: ({ children, initial, animate, exit, transition, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <nav {...props}>{children}</nav> }, AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</> }));

describe('Header', () => {
  beforeEach(() => { locale = 'en'; theme = 'light'; });
  it('renders desktop controls and opens/closes mobile navigation', async () => {
    render(<Header />); await waitFor(() => expect(screen.getByText('Kitty Kio')).toBeInTheDocument()); expect(screen.getAllByRole('link', { name: /projects/i })[0]).toHaveAttribute('href', '/projects'); expect(screen.getAllByText('Theme 40')).toHaveLength(1);
    const toggle = screen.getByRole('button', { name: 'Open menu' }); expect(toggle).toHaveAttribute('aria-expanded', 'false'); fireEvent.click(toggle); const close = screen.getByRole('button', { name: 'Close menu' }); expect(close).toHaveAttribute('aria-expanded', 'true'); expect(screen.getAllByRole('link', { name: /projects/i })).toHaveLength(2); expect(screen.getAllByText('Theme 40')).toHaveLength(2); fireEvent.click(close); expect(screen.getAllByRole('link', { name: /projects/i })).toHaveLength(1);
  });
  it('closes mobile navigation with Escape', async () => {
    render(<Header />); await waitFor(() => expect(screen.getByText('Kitty Kio')).toBeInTheDocument()); fireEvent.click(screen.getByRole('button', { name: 'Open menu' })); fireEvent.keyDown(window, { key: 'Escape' }); expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
  it('localizes routes and renders dark-theme icon choices', async () => {
    locale = 'ja'; theme = 'dark'; render(<Header />); await waitFor(() => expect(screen.getAllByRole('link', { name: /プロジェクト/ })[0]).toHaveAttribute('href', '/ja/projects')); expect(screen.getAllByRole('link', { name: /いま/ })[0]).toHaveAttribute('href', '/ja/now');
  });
});
