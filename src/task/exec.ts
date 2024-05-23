import {z} from 'zod';
import {BookSchema, Task, TaskResult} from '../types';
import {GenerateArticleSummaryTaskHandler} from './handler/article-summary';
import {BaseHandler} from './handler/base';
import {GenerateChapterSummaryTaskHandler} from './handler/chapter-summary';
import {GenerateSectionContentTaskHandler} from './handler/section-content';
import {GenerateSectionSummaryTaskHandler} from './handler/section-summary';
import {getBookRigidPrompt} from './rigid';

const handlerConstructors: Record<Task['type'], typeof BaseHandler<Task>> = {
  'section-content': GenerateSectionContentTaskHandler,
  'section-summary': GenerateSectionSummaryTaskHandler,
  'article-summary': GenerateArticleSummaryTaskHandler,
  'chapter-summary': GenerateChapterSummaryTaskHandler,
};

const executeTask = async (
  book: Omit<z.infer<typeof BookSchema>, 'chapters'>,
  task: Task
): Promise<TaskResult> => {
  const Handler = handlerConstructors[task.type];
  const prompt = getBookRigidPrompt(book);
  try {
    const content =
      await // @ts-expect-error: the handler is an implement child class
      (new Handler(task, prompt) as BaseHandler<Task>).exec();
    if (content === '') {
      throw new Error(`Content respond from ${task.type} handler was empty`);
    }
    return {
      error: null,
      content: content,
    };
  } catch (error) {
    const err = error as Error;
    return {
      error: err.message,
      content: null,
    };
  }
};

export {executeTask};
