export type ProjectType = {
  slug: string;
  id: number;
  date: string;
  like: number;
  title: string;
  description?: string;
  image: string;
  tags: string[];
  createdDate: Date;
  createdLocaleDate: string;
  modifiedDate: Date;
  likesPerUser?: number;
  repoUrl?: string;
  websiteUrl?: string;
};
