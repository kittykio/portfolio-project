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
  livePreview?: boolean;
  caseStudy?: {
    eyebrow?: string;
    statement?: string;
    problem: string;
    role: string;
    constraints: string;
    process: string;
    result: string;
    features?: string[];
    engineering?: string[];
  };
};
