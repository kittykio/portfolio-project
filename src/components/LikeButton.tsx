import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaRegHeart } from 'react-icons/fa';
import type { PostType } from '@/types/PostType';
import type { ProjectType } from '@/types/ProjectType';
import { getLikeStorageKey, MAX_LIKES_PER_USER, type LikeContentType } from '@/utils/likes';

// Array of paths for heart icons, used to visually indicate the number of likes per user.
const heartImages: string[] = Array.from(
  { length: MAX_LIKES_PER_USER },
  (_, index) => `/icons/likes/heart-${index + 1}.png`,
);

// Base type that all likeable items must extend.
type BaseLikeType = PostType | ProjectType;

// Defines the properties for the LikeButton component.
type LikeButtonProps<T extends BaseLikeType> = {
  // The specific item (post or project) being liked.
  likeItem: T;
  // Optional array of items, used when updating a list of liked items.
  likeItemList?: T[];
  // Optional state setter for a single item.
  setLikeItem?: React.Dispatch<React.SetStateAction<T>>;
  // Optional state setter for a list of items.
  setLikeItemList?: React.Dispatch<React.SetStateAction<T[]>>;
  // Function to call the backend API to update the like count, returning the new total like count.
  updateLike: (payload: { _id: number; seconds: number }) => Promise<number | undefined>;
  // The size (width/height) of the heart icon image.
  size: number;
  // Flag to indicate if the button is active (unused in the current component logic but kept in type definition).
  activate: boolean;
  // Optional click handler for external actions.
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // Flag to hide the button's background and default styling for a cleaner look.
  hideBackground?: boolean;
};

// A reusable, generic component for liking content. It tracks click-hold duration to award multiple likes at once.
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
  // State to determine which heart image to display based on the user's total likes for this item.
  // State to trigger a shake animation after a successful like update.
  const [isShaking, setIsShaking] = useState(false);
  const [remoteLike, setRemoteLike] = useState(likeItem.like);
  // Ref to store the timestamp when the mouse button is pressed down.
  const startTime = useRef<number | null>(null);
  const type: LikeContentType = 'medium' in likeItem ? 'project' : 'blog';
  const likesPerUser = Math.min(likeItem.likesPerUser ?? 0, MAX_LIKES_PER_USER);
  const hasReachedLimit = likesPerUser >= MAX_LIKES_PER_USER;

  useEffect(() => {
    fetch(`/api/likes?type=${type}&ids=${likeItem.id}`)
      .then((response) => response.json())
      .then((data) => setRemoteLike(data.likes?.[likeItem.id] ?? likeItem.like))
      .catch(() => setRemoteLike(likeItem.like));
  }, [likeItem.id, likeItem.like, type]);

  // Records the starting time when the user presses down on the button.
  const countSeconds = (): void => {
    if (hasReachedLimit) return;
    startTime.current = Date.now();
  };

  // Calculates the duration of the click, sends the update to the server, and updates local state.
  const countLikes = async (): Promise<void> => {
    // Exits if the mouse up event occurs without a preceding mouse down event.
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
    // Calls the external function to update the like count on the backend.
    const like = await updateLike({ _id: likeItem.id, seconds });
    // Exits if the update failed or returned no new count.
    if (like === undefined) return;

    // Creates the locally updated item object.
    const updated: T = {
      ...likeItem,
      like: like || likeItem.like + seconds, // Local fallback keeps the UI responsive without a database.
      likesPerUser: likesPerUser + seconds,
    };
    setRemoteLike(updated.like);

    // Updates the state for a list of items if the setter is provided.
    if (likeItemList && setLikeItemList) {
      setLikeItemList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
    // Updates the state for a single item if the setter is provided.
    if (setLikeItem) setLikeItem(updated);

    // Persists the new user like count to local storage for persistence across sessions.
    localStorage.setItem(getLikeStorageKey(type, likeItem.id), String(likesPerUser + seconds));

    // Triggers the shake animation for visual feedback.
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Animation duration is 500ms.
  };

  return (
    <button
      type="button"
      // Starts the time tracking when the mouse is pressed down.
      onMouseDown={countSeconds}
      // Stops the time tracking and processes the likes when the mouse is released.
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
