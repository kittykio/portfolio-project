'use server';

import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkBreaks from 'remark-breaks';
import { getCreatedDate, getModifiedDate } from '../utils/getDate';
import * as mdxComponents from '@/components/MdxComponents';
import SVGBezier from '@/components/SVGBezier';
import rehypeExtractHeadings from '@/utils/rehypeExtractHeadings';
import type { PostDetailType, PostType } from '@/types/PostType';
import type { Heading } from '@/types/HeadingType';
import '@/styles/monokai.scss';
import langBash from 'highlight.js/lib/languages/bash';
import langCss from 'highlight.js/lib/languages/css';
import langDockerfile from 'highlight.js/lib/languages/dockerfile';
import langJavaScript from 'highlight.js/lib/languages/javascript';
import langJson from 'highlight.js/lib/languages/json';
import langMarkdown from 'highlight.js/lib/languages/markdown';
import langTypeScript from 'highlight.js/lib/languages/typescript';
import langPlainText from 'highlight.js/lib/languages/plaintext';
import langXml from 'highlight.js/lib/languages/xml';
import Sparkly from '@/components/Sparkly';
import { defaultLocale, type Locale } from '@/i18n/config';

const contentSource = 'blog';

/**
 * Japanese articles intentionally mirror the English filenames. Until a
 * translation is added, readers see the English original rather than a 404.
 */
const getPostPath = (slug: string[], locale: Locale) => {
  const englishFile = path.join(process.cwd(), contentSource, slug.join('/') + '.mdx');
  const japaneseFile = path.join(process.cwd(), 'blog/ja', slug.join('/') + '.mdx');
  return locale === 'ja' && fs.existsSync(japaneseFile) ? japaneseFile : englishFile;
};

const languages = {
  bash: langBash,
  css: langCss,
  dockerfile: langDockerfile,
  html: langXml,
  javascript: langJavaScript,
  json: langJson,
  markdown: langMarkdown,
  mdx: langMarkdown,
  ts: langTypeScript,
  typescript: langTypeScript,
  plaintext: langPlainText,
  xml: langXml,
};

const aliases = {
  bash: 'shell',
  dockerfile: 'docker',
  javascript: 'js',
  markdown: 'md',
  plaintext: 'text',
  typescript: 'tsx',
};

// --- Frontmatter Type ---
type MDXFrontmatter = {
  date: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
};

/**
 * Produces a stable numeric database key from the article slug. New articles
 * therefore need no manual ID, while changing a slug intentionally starts a
 * new like record for the renamed article.
 */
const getGeneratedPostId = (slug: string[]): number => {
  let hash = 2166136261;
  for (const character of slug.join('/')) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }

  return 1_000_000_000 + (hash >>> 0);
};

const getReadingTime = (source: string): number => {
  const readableText = source
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#\[\]()]/g, ' ');
  const words = readableText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

// --- Get all MDX slugs ---
export const getSlugs = async (locale: Locale = defaultLocale): Promise<string[][]> => {
  const directoryPath = path.join(process.cwd(), contentSource);

  try {
    const targets = await fs.promises.readdir(directoryPath);
    const files: string[] = [];

    for (const target of targets) {
      const targetPath = path.join(directoryPath, target);
      const stats = await fs.promises.lstat(targetPath);
      if (!stats.isDirectory()) {
        files.push(target);
      }
    }

    return files.map((file) => file.replace('.mdx', '').split(path.sep));
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

// --- Get single post detail (with content) ---
export const getPostDetail = async (
  slug: string[],
  locale: Locale = defaultLocale,
): Promise<PostDetailType> => {
  const file = getPostPath(slug, locale);
  const source = await fs.promises.readFile(file, 'utf8');

  const headings: Heading[] = [];

  const { content, frontmatter } = await compileMDX<MDXFrontmatter>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkToc, remarkBreaks],
        rehypePlugins: [
          [rehypeHighlight, { ignoreMissing: true, languages, aliases }],
          rehypeSlug,
          [rehypeExtractHeadings, { rank: 6, headings }],
        ],
      },
      parseFrontmatter: true,
    },
    components: {
      ...mdxComponents,
      SVGBezier,
      Sparkly,
    },
  });

  const date = frontmatter.date;
  const title = frontmatter.title;
  const description = frontmatter.description;
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags];
  const image = frontmatter.image;

  const createdDate = getCreatedDate(file);
  const createdLocaleDate = createdDate.toLocaleDateString();
  const modifiedDate = getModifiedDate(file);

  const id = getGeneratedPostId(slug);

  const like = 0;

  const post: PostDetailType = {
    id,
    date,
    slug,
    like,
    title,
    description,
    tags,
    image,
    headings,
    content,
    createdDate,
    createdLocaleDate,
    modifiedDate,
    readingTime: getReadingTime(source),
  };

  return post;
};

// --- Get all posts ---
export async function getAllPosts(locale: Locale = defaultLocale): Promise<PostType[]> {
  const slugs = await getSlugs(locale);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { ...post } = await getPostDetail(slug, locale);
      return post;
    }),
  );

  const generatedIds = new Set(posts.map((post) => post.id));
  if (generatedIds.size !== posts.length) {
    throw new Error('Generated blog post IDs collided. Rename one of the duplicate article slugs.');
  }

  // Keep the default order aligned with the visible publication date in MDX,
  // rather than filesystem metadata that can change during a deploy or copy.
  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return posts;
}

// --- Get posts by tags OR categories ---
export async function getAllPostsByFilter(
  tags: string[],
  locale: Locale = defaultLocale,
): Promise<PostType[]> {
  const allPosts = await getAllPosts(locale);

  return allPosts.filter((post) => {
    const inTags = Array.isArray(post.tags) && post.tags.some((t) => tags.includes(t));

    return inTags;
  });
}

// --- Paginated posts (no content) ---
export async function getPaginatedPostList({
  activePage,
  limit,
  locale = defaultLocale,
}: {
  activePage: number;
  limit: number;
  locale?: Locale;
}): Promise<{ posts: PostType[]; total: number }> {
  const allPosts = await getAllPosts(locale);
  const paginatedPosts = allPosts.slice((activePage - 1) * limit, activePage * limit);
  return { posts: paginatedPosts, total: allPosts.length };
}

// --- Paginated posts by filter (no content) ---
export async function getPaginatedPostListByFilter({
  activePage,
  limit,
  tags,
  locale = defaultLocale,
}: {
  activePage: number;
  limit: number;
  tags: string[];
  locale?: Locale;
}): Promise<{ posts: PostType[]; total: number }> {
  const posts = await getAllPostsByFilter(tags, locale);
  const paginatedPosts = posts.slice((activePage - 1) * limit, activePage * limit);
  return { posts: paginatedPosts, total: posts.length };
}

// --- Get most popular posts (no content) ---
export async function getMostPopular(
  limit?: number,
  locale: Locale = defaultLocale,
): Promise<PostType[]> {
  const allPosts = await getAllPosts(locale);
  const sorted = [...allPosts].sort((a, b) => b.like - a.like);
  return limit ? sorted.slice(0, limit) : sorted;
}
