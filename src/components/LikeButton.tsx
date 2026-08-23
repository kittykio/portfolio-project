import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaRegHeart } from 'react-icons/fa';
import type { PostType } from '@/types/PostType';
import type { ProjectType } from '@/types/ProjectType';
import { getLikeStorageKey, MAX_LIKES_PER_USER, type LikeContentType } from '@/utils/likes';

// Each locally recorded reaction advances to the next heart illustration.
const heartImages: string[] = Array.from(
  { length: MAX_LIKES_PER_USER },
  (_, index) => `/icons/likes/heart-${index + 1}.png`,
);

type BaseLikeType = PostType | ProjectType;

type LikeButtonProps<T extends BaseLikeType> = {
  likeItem: T;
  likeItemList?: T[];
  setLikeItem?: React.Dispatch<React.SetStateAction<T>>;
  setLikeItemList?: React.Dispatch<React.SetStateAction<T[]>>;
  /** Persists the bounded increment and returns the new aggregate count. */
  updateLike: (payload: { _id: number; seconds: number }) => Promise<number | undefined>;
  size: number;
  /** Retained for compatibility with existing card call sites. */
  activate: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hideBackground?: boolean;
};

/** Converts a press duration into one to three reactions without exceeding the local user cap. */
const LikeButton = <T extends BaseLikeType>({
  likeItem,
  likeItemList,
  setLikeItem,
  setLikeItemList,
  updateLike,
  size,
  onClick,
  hideBackground = false,
}: LikeButtonProps<T>) => {
  const [isShaking, setIsShaking] = useState(false);
  const [remoteLike, setRemoteLike] = useState(likeItem.like);
  const startTime = useRef<number | null>(null);
  const type: LikeContentType = Array.isArray(likeItem.slug) ? 'blog' : 'project';
  const likesPerUser = Math.min(likeItem.likesPerUser ?? 0, MAX_LIKES_PER_USER);
  const hasReachedLimit = likesPerUser >= MAX_LIKES_PER_USER;

  useEffect(() => {
    fetch(`/api/likes?type=${type}&ids=${likeItem.id}`)
      .then((response) => response.json())
      .then((data) => setRemoteLike(data.likes?.[likeItem.id] ?? likeItem.like))
      .catch(() => setRemoteLike(likeItem.like));
  }, [likeItem.id, likeItem.like, type]);

  const countSeconds = (): void => {
    if (hasReachedLimit) return;
    startTime.current = Date.now();
  };

  const countLikes = async (): Promise<void> => {
    const startedAt = startTime.current;
    if (!startedAt) return;
    startTime.current = null;

    const remainingLikes = MAX_LIKES_PER_USER - likesPerUser;
    if (remainingLikes <= 0) return;

    // Long presses may award multiple likes, but never exceed the per-user limit.
    const seconds = Math.min(
      remainingLikes,
      3,
      Math.max(1, Math.ceil((Date.now() - startedAt) * 0.001)),
    );
    const like = await updateLike({ _id: likeItem.id, seconds });
    if (like === undefined) return;

    const updated: T = {
      ...likeItem,
      like: like || likeItem.like + seconds, // Local fallback keeps the UI responsive without a database.
      likesPerUser: likesPerUser + seconds,
    };
    setRemoteLike(updated.like);

    if (likeItemList && setLikeItemList) {
      setLikeItemList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
    if (setLikeItem) setLikeItem(updated);

    // The browser-side cap is per visitor; the database stores only the aggregate total.
    localStorage.setItem(getLikeStorageKey(type, likeItem.id), String(likesPerUser + seconds));

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <button
      type="button"
      onMouseDown={countSeconds}
      onMouseUp={() => void countLikes()}
      onClick={onClick}
      aria-label={hasReachedLimit ? `Maximum of ${MAX_LIKES_PER_USER} likes reached` : 'Like button'}
      aria-disabled={hasReachedLimit}
      disabled={hasReachedLimit}
      title={hasReachedLimit ? `You have reached the ${MAX_LIKES_PER_USER}-like limit` : undefined}
      className={`
        relative flex flex-row items-center gap-2
        px-4 py-2 rounded-full isolate w-fit
        ${
          // Applies background and shadow styles unless hideBackground is true.
          !hideBackground
            ? `justify-center min-w-[100px] h-[48px] bg-surface-glass-strong hover:bg-surface-glass backdrop-blur-xl border border-border/20
        shadow-[inset_1px_1px_2px_var(--shadow-inset-light),inset_-1px_-1px_2px_var(--shadow-inset-dark)]
        drop-shadow-[0_4px_12px_var(--shadow)]`
            : `justify-end`
        }
        cursor-pointer select-none
        // Applies a CSS animation on active state (click/hold).
        active:animate-heartbeat
        // Conditionally applies the shake animation after like update.
        ${isShaking ? 'animate-shake' : ''}
      `}
    >
      {likesPerUser > 0 ? (
        <Image src={heartImages[likesPerUser - 1]} alt="heart-icon" width={size} height={size} />
      ) : (
        <FaRegHeart aria-hidden size={size} />
      )}
      {/* Displays the total number of likes for the item. */}
      <span className="font-bodyBold text-content">{remoteLike}</span>
    </button>
  );
};

export default LikeButton;
