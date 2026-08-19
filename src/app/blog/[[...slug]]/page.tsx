import { getAllPosts } from '@/lib/blogApi';
import BlogPageClient from '../components/BlogPageClient';
import { getRequestLocale } from '@/i18n/server';

export const runtime = 'nodejs';

interface Props {
  params: { slug?: string[] };
}

const BlogPage = async ({ params }: Props) => {
  const { slug = [] } = params;

  const limit = 6;
  const tags = slug ?? [];
  const allPosts = await getAllPosts(getRequestLocale());

  return (
    <BlogPageClient
      allPosts={allPosts}
      initialTags={tags}
      limit={limit}
    />
  );
};

export default BlogPage;
