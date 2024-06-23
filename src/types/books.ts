import {z} from 'zod';

const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  prompt: z.string(),
  content: z.string().default(''),
  summary: z.string().default(''),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  articles: z.array(ArticleSchema),
  summary: z.string().default(''),
});

const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  author: z.string(),
  summary: z.string(),
  prompt: z.string(),
  chapters: z.array(ChapterSchema),
});

export {BookSchema, ChapterSchema, ArticleSchema};
