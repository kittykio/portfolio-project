'use client';

import React, { FC, Dispatch, SetStateAction } from 'react';
import type { PostType } from '@/types/PostType';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import LikeButton from '@/components/LikeButton';
import Image from 'next/image';
import Link from 'next/link';
import { updateLike } from '@/lib/blogAction';
import { Magnetic } from '@/components/Magnetic';
import { IoMdEye } from 'react-icons/io';
import { DisplayTag } from '@/components/Tag';
import { useLocale } from '@/components/LocaleContext';
import { getLocalePath } from '@/i18n/config';
import SaveButton from '@/components/SaveButton';

// Defines the properties for the PostItem component.
type PostItemProps = {
  // Index of the post in the list, used for staggering the CardFloatWrapper animation.
  index: number;
  // The post data, including like information.
  post: PostType;
  // The current list of all posts with their like status.
  postItemList: PostType[];
  // State setter to update the list of posts after a like action.
  setPostItemList: Dispatch<SetStateAction<PostType[]>>;
};

// A component that displays a single blog post item in a card format with a like button and details.
const PostItem: FC<PostItemProps> = ({ index, post, postItemList, setPostItemList }) => {
  const { locale } = useLocale();
  return (
    // Wraps the card in a float wrapper to provide a subtle vertical floating animation.
    <CardFloatWrapper index={index} tilt>
      <Card rounded className="p-4 group relative">
        {/* --- Desktop/Hover Like Button (Hidden by default, appears on card hover) --- */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2
        opacity-0 scale-0 pointer-events-none
        md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:pointer-events-auto
        transition-transform transition-opacity duration-300 ease-out z-20"
        >
          <LikeButton
            likeItem={post}
            likeItemList={postItemList}
            setLikeItemList={setPostItemList}
            updateLike={updateLike}
            activate
            size={28}
          />
        </div>

        {/* --- Post Info and Content --- */}
        <div className="flex flex-col gap-4 w-full">
          {/* Post Image */}
          <Image
            src={post.image}
            alt={post.title}
            width={1000}
            height={1000}
            className="h-auto w-full rounded object-cover"
            // Optimization for responsive image loading.
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <p className="text-sm text-gray-500">
            {post.date} <span aria-hidden="true">·</span>{' '}
            {locale === 'ja' ? `${post.readingTime}分で読めます` : `${post.readingTime} min read`}
          </p>
          <p className="text-lg font-bodyBold text-content">{post.title}</p>
          <p className="text-sm">{post.description}</p>

          {/* "See more" Link with Magnetic Effect */}
          <div className="flex justify-end">
            <Link href={getLocalePath(`/blog/post/${post.slug.join('/')}`, locale)}>
              <Magnetic>
                <div className="expanding_underline">
                  <p className="flex items-center gap-2 font-bodyBold text-content">
                    {locale === 'ja' ? '続きを読む' : 'See more..'}
                    <IoMdEye />
                  </p>
                </div>
              </Magnetic>
            </Link>
          </div>
          <div className="flex justify-end"><SaveButton type="blog" id={post.id} title={post.title} href={getLocalePath(`/blog/post/${post.slug.join('/')}`, locale)} /></div>

          {/* Tags and Categories */}
          <div className="flex flex-wrap gap-2 mt-2 mb-6">
            {post.tags.map((item, i) => (
              <DisplayTag key={i} tag={item} />
            ))}
          </div>

          {/* --- Mobile/Permanent Like Button (Hidden on desktop) --- */}
          {/* This button is styled to be more subtle (hideBackground) and permanently visible on mobile. */}
          <div className="z-20 self-end md:hidden">
            <LikeButton
              likeItem={post}
              likeItemList={postItemList}
              setLikeItemList={setPostItemList}
              updateLike={updateLike}
              activate
              size={28}
              hideBackground // Hides the background for a more integrated mobile look.
            />
          </div>
        </div>
      </Card>
    </CardFloatWrapper>
  );
};

export default PostItem;
