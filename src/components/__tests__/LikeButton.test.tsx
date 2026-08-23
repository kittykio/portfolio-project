import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LikeButton from '@/components/LikeButton';
import { getLikeStorageKey, MAX_LIKES_PER_USER } from '@/utils/likes';
import type { ProjectType } from '@/types/ProjectType';
import type { PostType } from '@/types/PostType';

const project = (overrides: Partial<ProjectType> = {}): ProjectType => ({
  id: 7, slug: 'seven', date: '2025-01-01', like: 4, title: 'Seven', description: 'Project', image: '/seven.png', tags: ['React'], createdDate: new Date(), createdLocaleDate: '1/1/2025', modifiedDate: new Date(), ...overrides,
});
const post = (overrides: Partial<PostType> = {}): PostType => ({
  id: 8, slug: ['eight'], date: '2025-01-01', like: 2, title: 'Eight', description: 'Post', image: '/eight.png', tags: [], headings: [], createdDate: new Date(), createdLocaleDate: '1/1/2025', modifiedDate: new Date(), readingTime: 2, ...overrides,
});

describe('LikeButton', () => {
  beforeEach(() => { localStorage.clear(); global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ likes: { 7: 9, 8: 3 } }) } as Response); });

  it('loads the remote project total and awards one like on a click', async () => {
    const updateLike = jest.fn().mockResolvedValue(10); const setLikeItem = jest.fn(); const setLikeItemList = jest.fn();
    render(<LikeButton likeItem={project()} likeItemList={[project()]} setLikeItem={setLikeItem} setLikeItemList={setLikeItemList} updateLike={updateLike} size={24} activate />);
    await waitFor(() => expect(screen.getByText('9')).toBeInTheDocument());
    const now = jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1001);
    const button = screen.getByRole('button', { name: 'Like button' }); fireEvent.mouseDown(button); fireEvent.mouseUp(button);
    await waitFor(() => expect(updateLike).toHaveBeenCalledWith({ _id: 7, seconds: 1 }));
    expect(setLikeItem).toHaveBeenCalledWith(expect.objectContaining({ like: 10, likesPerUser: 1 }));
    const updater = setLikeItemList.mock.calls[0][0]; expect(updater([project()])[0]).toMatchObject({ like: 10, likesPerUser: 1 });
    await waitFor(() => expect(localStorage.getItem(getLikeStorageKey('project', 7))).toBe('1')); now.mockRestore();
  });

  it('awards at most three likes for a long press and uses the local fallback total', async () => {
    const updateLike = jest.fn().mockResolvedValue(0);
    render(<LikeButton likeItem={post({ likesPerUser: 4 })} updateLike={updateLike} size={20} activate />);
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
    const now = jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(10000);
    const button = screen.getByRole('button', { name: 'Like button' }); fireEvent.mouseDown(button); fireEvent.mouseUp(button);
    await waitFor(() => expect(updateLike).toHaveBeenCalledWith({ _id: 8, seconds: 3 }));
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument()); expect(localStorage.getItem(getLikeStorageKey('blog', 8))).toBe('7'); now.mockRestore();
  });

  it('does nothing on mouse-up without a preceding press or failed update', async () => {
    const updateLike = jest.fn().mockResolvedValue(undefined);
    render(<LikeButton likeItem={project()} updateLike={updateLike} size={20} activate />);
    fireEvent.mouseUp(screen.getByRole('button')); expect(updateLike).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole('button')); fireEvent.mouseUp(screen.getByRole('button'));
    await waitFor(() => expect(updateLike).toHaveBeenCalled()); expect(localStorage.length).toBe(0);
  });

  it('disables reactions at the per-user limit', () => {
    const updateLike = jest.fn(); render(<LikeButton likeItem={project({ likesPerUser: MAX_LIKES_PER_USER })} updateLike={updateLike} size={20} activate />);
    const button = screen.getByRole('button', { name: `Maximum of ${MAX_LIKES_PER_USER} likes reached` });
    expect(button).toBeDisabled(); fireEvent.mouseDown(button); expect(updateLike).not.toHaveBeenCalled();
  });

  it('falls back to the supplied total when remote loading fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    render(<LikeButton likeItem={post()} updateLike={jest.fn()} size={20} activate hideBackground />);
    await act(async () => undefined); expect(screen.getByText('2')).toBeInTheDocument();
  });
});
