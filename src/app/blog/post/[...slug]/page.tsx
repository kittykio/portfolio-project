import { getAllPosts, getSlugs, getPostDetail } from '@/lib/blogApi';
import PostDetail from '@/app/blog/components/PostDetail';
import type { PostDetailType, PostType } from '@/types/PostType';
import type { Metadata } from 'next';
import { getRequestLocale } from '@/i18n/server';
import { getOgCardUrl } from '@/lib/site';

export const runtime = 'nodejs';

interface Props {
  params: { slug: string[] };
}

export const generateStaticParams = async () => {
  const slugs = await getSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const locale = getRequestLocale();
  const post = await getPostDetail(params.slug, locale);
  const pathname = `${locale === 'ja' ? '/ja' : ''}/blog/post/${params.slug.join('/')}`;
  const image = getOgCardUrl({
    title: post.title,
    description: post.description,
    type: 'post',
    locale,
  });
  return { title: `${post.title} | Kitty Kio`, description: post.description, alternates: { canonical: pathname }, openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, images: [{ url: image, width: 1200, height: 630, alt: `${post.title} — Kitty Kio post` }] }, twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [image] } };
};

const PostPage = async ({ params }: Props) => {
  const slug = params.slug;
  const locale = getRequestLocale();
  const post: PostDetailType = await getPostDetail(slug, locale);
  const posts: PostType[] = await getAllPosts(locale);

  return <PostDetail post={post} posts={posts} />;
};

export default PostPage;
