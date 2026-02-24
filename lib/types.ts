export type Collection = "blog" | "notes";

export type EntryFrontmatter = {
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
};

export type ContentEntry = EntryFrontmatter & {
  slug: string;
  collection: Collection;
  body: string;
};

export type ResumeBasics = {
  name: string;
  title: string;
  email: string;
  location: string;
  summary: string;
};

export type ResumeExperienceItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  summary: string;
};

export type ResumeEducationItem = {
  school: string;
  degree: string;
  start: string;
  end: string;
};

export type ResumeData = {
  basics: ResumeBasics;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: string[];
};
