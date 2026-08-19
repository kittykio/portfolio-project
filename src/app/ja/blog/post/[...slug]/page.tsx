import PostDetail from '@/app/blog/components/PostDetail';
import { getAllPosts, getPostDetail } from '@/lib/blogApi';

export const runtime = 'nodejs';

const JapanesePostPage = async ({ params }: { params: { slug: string[] } }) => (
  <PostDetail post={await getPostDetail(params.slug, 'ja')} posts={await getAllPosts('ja')} />
);

export default JapanesePostPage;
