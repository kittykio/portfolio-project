import { getLikeStorageKey, getStoredLikes, MAX_LIKES_PER_USER } from '@/utils/likes';

describe('like storage', () => {
  beforeEach(() => localStorage.clear());

  it('uses a content-specific storage key', () => {
    expect(getLikeStorageKey('blog', 12)).toBe('portfolio-project:likes:blog:12');
  });

  it('reads and clamps stored values', () => {
    localStorage.setItem(getLikeStorageKey('project', 2), '99');
    expect(getStoredLikes('project', 2)).toBe(MAX_LIKES_PER_USER);
    localStorage.setItem(getLikeStorageKey('project', 2), '-4');
    expect(getStoredLikes('project', 2)).toBe(0);
    localStorage.setItem(getLikeStorageKey('project', 2), 'invalid');
    expect(getStoredLikes('project', 2)).toBe(0);
  });
});
