import {z} from 'zod';

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
});

const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  sections: z.array(SectionSchema),
  summary: z.string().optional(),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  articles: z.array(ArticleSchema),
  summary: z.string().optional(),
});

const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  author: z.string(),
  summary: z.string(),
  prompt: z.string().optional(),
  chapters: z.array(ChapterSchema),
});

export {BookSchema, ChapterSchema, ArticleSchema, SectionSchema};
