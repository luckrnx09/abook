import {z} from 'zod';

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  /**
   * @ai-look-here
   * Guidance to AIGC on how to generate section content.
   * e.g.: Specifically describe
   * - What key points need to be included in the section
   * - What valuable information should be referenced
   * - Avoid generating specific undesired content
   */
  prompt: z.string().optional(),
  /**
   * @ai-ignore
   */
  content: z.string().optional(),
  /**
   * @ai-ignore
   */
  summary: z.string().optional(),
});

const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  sections: z.array(SectionSchema),
  /**
   * @ai-ignore
   */
  summary: z.string().optional(),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  articles: z.array(ArticleSchema),
  /**
   * @ai-ignore
   */
  summary: z.string().optional(),
});

const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  author: z.string(),
  summary: z.string(),
  /**
   * @ai-look-here
   * Guidance for the AIGC on the uniform norms to be followed in the preparation of each text of this book.
   * e.g.: Specifically describe
   * - Creative writing by imitating the writing techniques of whoever
     - Use more tables for data presentation
     - Use more humorous short stories to explain complex concepts
   */
  prompt: z.string().optional(),
  chapters: z.array(ChapterSchema),
});

export {BookSchema, ChapterSchema, ArticleSchema, SectionSchema};
