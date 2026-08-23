import { render, screen } from '@testing-library/react';
import AboutThisAppContent from '@/app/about-this-app/AboutThisAppContent';

describe('AboutThisAppContent', () => {
  it('renders the complete English product guide and navigation', () => {
    render(<AboutThisAppContent />);
    expect(screen.getByRole('heading', { level: 1, name: 'About this app' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Architecture & stack' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Analytics & insights setup' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Next.js 14 App Router', { exact: false })).toBeInTheDocument();
  });

  it('renders localized Japanese copy and routes', () => {
    render(<AboutThisAppContent locale="ja" />);
    expect(screen.getByRole('heading', { level: 1, name: 'このアプリについて' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '分析とインサイトの設定' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'プロジェクトを見る' })).toHaveAttribute('href', '/ja/projects');
    expect(screen.getByRole('link', { name: '相談をはじめる' })).toHaveAttribute('href', '/ja/contact');
  });
});
