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

interface GenerateSectionContentTask {
  type: 'section-content';
  summaries: {
    chapters: string[];
    previousSectionsOfCurrentArticle: string[];
  };
  section: Omit<z.infer<typeof SectionSchema>, 'content'>;
  path: string;
}

interface GenerateSectionSummaryTask {
  type: 'section-summary';
  content: string;
  path: string;
}

interface GenerateArticleSummaryTask {
  type: 'article-summary';
  summaries: {
    sections: string[];
  };
  path: string;
}

interface GenerateChapterSummaryTask {
  type: 'chapter-summary';
  summaries: {
    articles: string[];
  };
  path: string;
}

type Task =
  | GenerateSectionContentTask
  | GenerateSectionSummaryTask
  | GenerateArticleSummaryTask
  | GenerateChapterSummaryTask;

interface SuccessTaskResult {
  error: null;
  content: string;
}
interface FailTaskResult {
  error: string;
  content: null;
}
type TaskResult = SuccessTaskResult | FailTaskResult;

export {
  BookSchema,
  ChapterSchema,
  ArticleSchema,
  SectionSchema,
  Task,
  TaskResult,
};
