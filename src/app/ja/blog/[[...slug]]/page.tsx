import BlogPageClient from '@/app/blog/components/BlogPageClient';
import { getAllPosts } from '@/lib/blogApi';

export const runtime = 'nodejs';

const JapaneseBlogPage = async ({ params }: { params: { slug?: string[] } }) => (
  <BlogPageClient allPosts={await getAllPosts('ja')} initialTags={params.slug ?? []} limit={6} />
);

export default JapaneseBlogPage;
