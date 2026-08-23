import type { Heading } from '@/types/HeadingType';

export type PostType = {
  id: number;
  date: string;
  slug: string[];
  like: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  headings: Heading[];
  createdDate: Date;
  createdLocaleDate: string;
  modifiedDate: Date;
  readingTime: number;
  likesPerUser?: number;
};

export type PostDetailType = PostType & {
  content: string | React.ReactNode | React.ReactElement;
};
