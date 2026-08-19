'use client';

import PostList from '@/app/blog/components/PostList';
import Pagination from '@/components/Pagination';
import { PostType } from '@/types/PostType';
import SectionWrapper from '@/components/SectionWrapper';
import BlogFitler from '@/app/blog/components/BlogFitler';
import { useEffect, useMemo, useState } from 'react';
import SortTabs, { SortOption } from '@/components/SortTabs';
import { useLocale } from '@/components/LocaleContext';

type BlogPageClientProps = {
  allPosts: PostType[];
  initialTags: string[];
  limit: number;
};

// Keep tag links readable while using the source tag as the filter value.
// Example: "Local Development" becomes "/blog/local-development".
const toTagPathSegment = (tag: string) => tag
  .trim()
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/(^-|-$)/g, '');

const BlogPageClient = ({ allPosts, initialTags, limit }: BlogPageClientProps) => {
  const { locale } = useLocale();
  const availableTags = useMemo(
    () => Array.from(new Set(allPosts.flatMap((post) => post.tags))),
    [allPosts],
  );
  const resolvedInitialTags = useMemo(
    () => initialTags.flatMap((segment) => {
      const matchingTag = availableTags.find((tag) => toTagPathSegment(tag) === toTagPathSegment(segment));
      return matchingTag ? [matchingTag] : [];
    }),
    [availableTags, initialTags],
  );
  const [selectedFilters, setSelectedFilters] = useState(resolvedInitialTags);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [postsWithLikes, setPostsWithLikes] = useState(allPosts);

  useEffect(() => {
    let cancelled = false;
    const ids = allPosts.map((post) => post.id).join(',');

    fetch(`/api/likes?type=blog&ids=${ids}`)
      .then((response) => response.json())
      .then((data: { likes?: Record<string, number> }) => {
        if (cancelled) return;
        setPostsWithLikes((current) =>
          current.map((post) => ({ ...post, like: data.likes?.[post.id] ?? post.like })),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedFilters.length === 0) return postsWithLikes;

    return postsWithLikes.filter(
      (post) =>
        post.tags.some((tag) => selectedFilters.includes(tag)),
    );
  }, [postsWithLikes, selectedFilters]);

  const sortedPosts = useMemo(() => {
    const posts = [...filteredPosts];
    if (sortBy === 'mostPopular') posts.sort((a, b) => b.like - a.like);
    // `date` is the article's published date from MDX frontmatter. File timestamps
    // change whenever content is copied or edited, so they are not reliable for readers.
    if (sortBy === 'newest') posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sortBy === 'oldest') posts.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return posts;
  }, [filteredPosts, sortBy]);

  const paginatedPosts = useMemo(() => {
    const start = (activePage - 1) * limit;
    return sortedPosts.slice(start, start + limit);
  }, [activePage, sortedPosts, limit]);

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setActivePage(1);
  };

  useEffect(() => {
    const filterPath = selectedFilters.map(toTagPathSegment).join('/');
    const basePath = locale === 'ja' ? '/ja/blog' : '/blog';
    window.history.replaceState(null, '', filterPath ? `${basePath}/${filterPath}` : basePath);
  }, [selectedFilters, locale]);

  return (
    <SectionWrapper
      title={locale === 'ja' ? 'ブログ' : 'Blog'}
      subtitle=""
      className="px-4 max-w-7xl mx-auto pb-[700px] mt-[100px]"
    >
      <BlogFitler
        posts={allPosts}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
      />
      <PostList posts={paginatedPosts} sortBy={sortBy} onSortChange={(option) => {
        setSortBy(option);
        setActivePage(1);
      }} />
      <Pagination
        activePage={activePage}
        limit={limit}
        total={sortedPosts.length}
        mode="client"
        onPageChange={setActivePage}
      />
    </SectionWrapper>
  );
};

export default BlogPageClient;
