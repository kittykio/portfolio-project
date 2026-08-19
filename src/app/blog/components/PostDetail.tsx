'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { TableOfContents } from '@/app/blog/components/TableOfContents';
import PopularPosts from '@/app/blog/components/PopularPosts';
import { DisplayTag } from '@/components/Tag';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/blogAction';
import { PostDetailType, PostType } from '@/types/PostType';
import { getStoredLikes } from '@/utils/likes';
import { useLocale } from '@/components/LocaleContext';
import ShareButton from '@/components/ShareButton';
import SaveButton from '@/components/SaveButton';
import { getLocalePath } from '@/i18n/config';
import Link from 'next/link';
import { trackEvent } from '@/components/AnalyticsEvent';

type Props = {
  post: PostDetailType;
  posts: PostType[];
};

const PostDetail = ({ post, posts }: Props) => {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [postItem, setPostItem] = useState<PostDetailType>(null!);
  const currentPostId = post.id;
  const seriesPosts = [...posts]
    .filter((candidate) => candidate.id !== post.id && candidate.tags.some((tag) => post.tags.includes(tag)))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const chronological = [...seriesPosts, post].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const position = chronological.findIndex((candidate) => candidate.id === post.id);
  const previousPost = chronological[position - 1];
  const nextPost = chronological[position + 1];
  const relatedCopy = locale === 'ja'
    ? {
      label: '共通のトピックの記事',
        previous: '← 前の関連記事',
        next: '次の関連記事 →',
      }
    : {
        label: 'Related posts',
        previous: '← Earlier related post',
        next: 'Next related post →',
      };

  useEffect(() => {
    setPostItem({ ...post, likesPerUser: getStoredLikes('blog', post.id) });
    setMounted(true);
    trackEvent('post_view', post.title);
  }, [post]);

  useEffect(() => {
    const onScroll = () => { const height = document.documentElement.scrollHeight - window.innerHeight; if (height > 0 && window.scrollY / height > 0.9) { trackEvent('reading_complete', post.title); window.removeEventListener('scroll', onScroll); } };
    window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll);
  }, [post.title]);

  if (!mounted) return null;

  return (
    <SectionWrapper className="max-w-7xl mx-auto px-4 pb-[700px] mt-32 sm:mt-36 lg:mt-24">
      {/* === Layout Grid === */}
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_16rem] gap-12 relative">
        {/* === TOC (Desktop) === */}
        <aside className="hidden lg:block sticky top-36 h-fit self-start">
          <TableOfContents
            headings={postItem.headings}
            postItem={postItem}
            setPostItem={setPostItem}
          />
        </aside>

        {/* === Main Content === */}
        <main className="flex flex-col items-center gap-8">
          {/* Title */}
          <h1 className="text-center font-bodyBold text-3xl sm:text-4xl md:text-5xl">{postItem.title}</h1>

          {/* Description */}
          <p className="max-w-[75ch] text-center text-base font-bodyBold sm:text-lg">{postItem.description}</p>
          <p className="text-sm text-gray-500">{postItem.date} <span aria-hidden="true">·</span> {locale === 'ja' ? `${postItem.readingTime}分で読めます` : `${postItem.readingTime} min read`}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {postItem.tags.map((item) => (
              <DisplayTag key={item} tag={item} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2"><ShareButton title={postItem.title} /><SaveButton type="blog" id={postItem.id} title={postItem.title} href={getLocalePath(`/blog/post/${postItem.slug.join('/')}`, locale)} /></div>

          {/* Like Button (Mobile only) */}
          <div className="flex w-full justify-end sm:w-[80%] lg:hidden">
            <LikeButton
              likeItem={postItem}
              setLikeItem={setPostItem}
              updateLike={updateLike}
              activate
              size={28}
              hideBackground
            />
          </div>

          {/* Main Image */}
          <div className="my-8 w-full overflow-hidden rounded-lg sm:max-w-[80%]">
            <Image
              src={postItem.image}
              alt="Post Main Image"
              width={1000}
              height={1000}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* TOC (Mobile only) */}
          <div className="lg:hidden my-12 w-full">
            <TableOfContents
              headings={postItem.headings}
              postItem={postItem}
              setPostItem={setPostItem}
            />
          </div>

          {/* Article Content */}
          <article className="w-full max-w-[75ch] prose">{postItem.content}</article>
          {(previousPost || nextPost) && <nav aria-label={relatedCopy.label} className="grid w-full max-w-[75ch] gap-4 border-t border-border pt-8 sm:grid-cols-2">
            <p className="text-sm font-bodyBold text-content-muted sm:col-span-2">{relatedCopy.label}</p>
            {previousPost ? <Link href={getLocalePath(`/blog/post/${previousPost.slug.join('/')}`, locale)} className="rounded-2xl bg-surface-glass p-5 hover:text-flame-500"><span className="text-sm">{relatedCopy.previous}</span><strong className="mt-2 block">{previousPost.title}</strong></Link> : <div />}
            {nextPost ? <Link href={getLocalePath(`/blog/post/${nextPost.slug.join('/')}`, locale)} className="rounded-2xl bg-surface-glass p-5 text-right hover:text-flame-500"><span className="text-sm">{relatedCopy.next}</span><strong className="mt-2 block">{nextPost.title}</strong></Link> : <div />}
          </nav>}
        </main>

        {/* Balances the desktop table-of-contents column so the article stays centered. */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      {/* === Popular Posts === */}
      <div className="w-full mt-24">
        <PopularPosts posts={posts} currentPostId={currentPostId} locale={locale} />
      </div>
    </SectionWrapper>
  );
};

export default PostDetail;
