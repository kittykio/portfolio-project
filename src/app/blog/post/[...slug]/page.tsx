import { getAllPosts, getSlugs, getPostDetail } from '@/lib/blogApi';
import PostDetail from '@/app/blog/components/PostDetail';
import type { PostDetailType, PostType } from '@/types/PostType';
import type { Metadata } from 'next';
import { getRequestLocale } from '@/i18n/server';
import { getOgCardUrl } from '@/lib/site';
import { absoluteUrl, breadcrumbs, contentDate, localizedPath, pageMetadata } from '@/lib/seo';
import { hasJapanesePost } from '@/lib/contentSeo';
import StructuredData from '@/components/StructuredData';
import { notFound } from 'next/navigation';

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
  if (!(await getSlugs()).some(item => item.join('/') === params.slug.join('/'))) notFound();
  const locale = getRequestLocale();
  const post = await getPostDetail(params.slug, locale);
  const translated = hasJapanesePost(params.slug);
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/post/${params.slug.join('/')}`, locale: locale === 'ja' && !translated ? 'en' : locale, translated, type: 'post', publishedTime: contentDate(post.date) });
};

const PostPage = async ({ params }: Props) => {
  const slug = params.slug;
  if (!(await getSlugs()).some(item => item.join('/') === slug.join('/'))) notFound();
  const locale = getRequestLocale();
  const post: PostDetailType = await getPostDetail(slug, locale);
  const posts: PostType[] = await getAllPosts(locale);

  const contentLocale = locale === 'ja' && hasJapanesePost(slug) ? 'ja' : 'en';
  const pathname = localizedPath(`/blog/post/${slug.join('/')}`, contentLocale);
  return <>
    <StructuredData data={[
      { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, url: absoluteUrl(pathname), mainEntityOfPage: absoluteUrl(pathname), inLanguage: contentLocale, datePublished: contentDate(post.date), author: { '@type': 'Person', name: 'Kitty Kio', url: absoluteUrl('/') }, image: getOgCardUrl({ title: post.title, description: post.description, type: 'post', locale: contentLocale }) },
      breadcrumbs([{ name: 'Kitty Kio', path: localizedPath('/', locale) }, { name: locale === 'ja' ? 'ブログ' : 'Blog', path: localizedPath('/blog', locale) }, { name: post.title, path: pathname }]),
    ]} />
    <PostDetail post={post} posts={posts} />
  </>;
};

export default PostPage;
