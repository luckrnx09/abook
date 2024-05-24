import {z} from 'zod';
import {SectionSchema} from './books';

interface GenerateSectionContentTask {
  type: 'section-content';
  summaries: {
    chapters: {number: number; summary: string}[];
    previousSectionsOfCurrentArticle: {number: number; summary: string}[];
  };
  article: {number: number; title: string};
  chapter: {number: number; title: string};
  section: {number: number} & Omit<z.infer<typeof SectionSchema>, 'content'>;
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
    sections: {number: number; summary: string}[];
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
  GenerateArticleSummaryTask,
  GenerateChapterSummaryTask,
  GenerateSectionContentTask,
  GenerateSectionSummaryTask,
  Task,
  TaskResult,
};
