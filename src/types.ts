import {z} from 'zod';

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string().optional(),
  content: z.string().optional(),
});

const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  sections: z.array(SectionSchema),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  articles: z.array(ArticleSchema),
});

const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  author: z.string(),
  chapters: z.array(ChapterSchema),
});

const GeneratedArticlesSchema = z.record(z.record(z.string()));

export {
  BookSchema,
  ChapterSchema,
  ArticleSchema,
  SectionSchema,
  GeneratedArticlesSchema,
};
