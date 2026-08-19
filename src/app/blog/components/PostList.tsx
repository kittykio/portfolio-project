'use client';

import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import { PostType } from '@/types/PostType';
import PostItem from '../../../components/PostItem';
import { getStoredLikes } from '@/utils/likes';
import SortTabs, { type SortOption } from '@/components/SortTabs';

type PostListProps = {
  posts: PostType[];
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
};

type LikesResponse = { likes: Record<string, number> };

const PostList: FC<PostListProps> = ({ posts, sortBy, onSortChange }) => {
  const [postItemList, setPostItemList] = useState<PostType[]>(posts);

  useEffect(() => {
    const enriched: PostType[] = posts.map((post) => ({
      ...post,
      likesPerUser: getStoredLikes('blog', post.id),
    }));
    // Client-only localStorage hydration reconciles the visible cards after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPostItemList(enriched);
  }, [posts]);

  useEffect(() => {
    let cancelled = false;
    const ids = posts.map((post) => post.id).join(',');

    fetch(`/api/likes?type=blog&ids=${ids}`)
      .then((response) => response.json())
      .then((data: LikesResponse) => {
        if (cancelled) return;
        setPostItemList((current) =>
          current.map((post) => ({ ...post, like: data.likes?.[post.id] ?? post.like })),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <>
      {/* Sorting Tabs */}
      <SortTabs sortBy={sortBy} onChange={onSortChange} />

      {/* Variable-height masonry columns, matching the original artwork listing. */}
      <motion.div
        key={postItemList.map((post) => post.id).join('-')}
        className="columns-1 gap-8 px-0 sm:columns-2 sm:gap-10 sm:px-4 lg:columns-3 lg:gap-12 lg:px-8"
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
      >
        {postItemList.map((post, i) => (
          <motion.div
            key={post.id}
            className="relative w-full break-inside-avoid group pb-24 sm:pb-36"
            variants={fadeIn('up', 'spring', i * 0.1, 1)}
          >
            <PostItem
              index={i}
              post={post}
              postItemList={postItemList}
              setPostItemList={setPostItemList}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default PostList;
