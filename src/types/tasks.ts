import {z} from 'zod';
import {ArticleSchema} from './books';

interface GenerateArticleContentTask {
  type: 'article-content';
  summaries: {
    chapters: {number: number; summary: string}[];
  };
  chapter: {number: number; title: string};
  previousArticlesOfCurrentChapter: {number: number; title: string}[];
  article: {number: number} & Omit<z.infer<typeof ArticleSchema>, 'content'>;
  path: string;
}

interface GenerateArticleSummaryTask {
  type: 'article-summary';
  article: {
    number: number;
    content: string;
  };
  path: string;
}

interface GenerateChapterSummaryTask {
  type: 'chapter-summary';
  summaries: {
    articles: {number: number; summary: string}[];
  };
  path: string;
}

type Task =
  | GenerateArticleContentTask
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
  GenerateArticleSummaryTask,
  GenerateChapterSummaryTask,
  GenerateArticleContentTask,
  Task,
  TaskResult,
};
