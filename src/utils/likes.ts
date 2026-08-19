export const MAX_LIKES_PER_USER = 10;

export type LikeContentType = 'blog' | 'project';

export const getLikeStorageKey = (type: LikeContentType, id: number): string =>
  `portfolio-project:likes:${type}:${id}`;

export const getStoredLikes = (type: LikeContentType, id: number): number => {
  if (typeof window === 'undefined') return 0;

  const value = Number(localStorage.getItem(getLikeStorageKey(type, id))) || 0;
  return Math.min(Math.max(value, 0), MAX_LIKES_PER_USER);
};
