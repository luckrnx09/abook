import {z} from 'zod';

const ArticleSchema = z.object({
  /**
   * @ai-looks-here Generate a uuid, always in English
   */
  id: z.string(),
  title: z.string(),
  /**
   * @ai-looks-here
   * Always use English expressions to generate slug to better support SEO
   */
  slug: z.string(),
  /**
   * @ai-looks-here
   * Guidance to AIGC on how to generate the article content.
   * e.g.: Specifically describe
   * - What key points need to be included in the section
   * - What valuable information should be referenced
   * - Avoid generating specific undesired content
   */
  prompt: z.string(),
  /**
   * @ai-ignore
   */
  content: z.string().default(''),
  /**
   * @ai-ignore
   */
  summary: z.string().default(''),
});
type a = z.infer<typeof ArticleSchema>;

const ChapterSchema = z.object({
  /**
   * @ai-looks-here Generate a uuid, always in English
   */
  id: z.string(),
  title: z.string(),
  articles: z.array(ArticleSchema),
  /**
   * @ai-ignore
   */
  summary: z.string().default(''),
});

const BookSchema = z.object({
  /**
   * @ai-looks-here Generate from the title, always in English
   */
  id: z.string(),
  title: z.string(),
  language: z.string(),
  author: z.string(),
  summary: z.string(),
  /**
   * @ai-looks-here
   * Guidance for the AIGC on the uniform norms to be followed in the preparation of each text of this book.
   * e.g.: Specifically describe
   * - Creative writing by imitating the writing techniques of whoever
     - Use more tables for data presentation
     - Use more humorous short stories to explain complex concepts
   */
  prompt: z.string(),
  chapters: z.array(ChapterSchema),
});

export {BookSchema, ChapterSchema, ArticleSchema};
