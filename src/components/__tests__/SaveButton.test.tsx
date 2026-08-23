import { fireEvent, render, screen } from '@testing-library/react';
import SaveButton from '@/components/SaveButton';
import { trackEvent } from '@/components/AnalyticsEvent';

jest.mock('@/components/AnalyticsEvent', () => ({ trackEvent: jest.fn() }));

describe('SaveButton', () => {
  beforeEach(() => localStorage.clear());

  it('saves, reports analytics, and removes an item', () => {
    render(<SaveButton type="project" id={7} title="Seven" href="/projects/seven" />);
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true');
    expect(JSON.parse(localStorage.getItem('kiki-saved-project') || '[]')).toEqual([
      { id: 7, title: 'Seven', href: '/projects/seven' },
    ]);
    expect(trackEvent).toHaveBeenCalledWith('saved', 'Seven');
    fireEvent.click(screen.getByRole('button', { name: 'Saved' }));
    expect(localStorage.getItem('kiki-saved-project')).toBe('[]');
  });

  it('hydrates its state from local storage', () => {
    localStorage.setItem('kiki-saved-blog', JSON.stringify([{ id: 'post-1' }]));
    render(<SaveButton type="blog" id="post-1" title="Post" href="/blog/post/post-1" />);
    expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
  });
});
