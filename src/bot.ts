import {z} from 'zod';
import {BookSchema} from './types';
import {logger} from './logger';
import {executeTask} from './task/exec';
import {findNextTask} from './task/find';
import * as jsonpatch from 'fast-json-patch';
import {persistBook} from './bridge';

const sleep = (ms: number) =>
  new Promise(resolve => {
    setInterval(resolve, ms);
  });

const start = async (book: z.infer<typeof BookSchema>) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const task = findNextTask(book);
    if (task === null) {
      break;
    }
    const {error, content} = await executeTask(book, task);
    if (error) {
      logger.error(
        new Error(
          `❌ An error occurred while executing the ${task.type} task: ${error}`
        )
      );
      await sleep(10000);
      continue;
    }
    const newBook = jsonpatch.applyPatch(book, [
      {
        op: 'add',
        path: task.path,
        value: content,
      },
    ]).newDocument;
    await persistBook(newBook);
    logger.info(
      `✅ Task [${task.type} for ${task.path}] executed successfully`
    );
    book = newBook;
    await sleep(5000);
  }
  logger.info('🎉 Congratulations! Book is finished');
};

const toMarkdown = (book: z.infer<typeof BookSchema>) => {
  let markdown = `\n# ${book.title}\n${book.author}\n`;
  book.chapters.forEach((chapter, chapterIndex) => {
    markdown += `\n## ${chapterIndex + 1} - ${chapter.title}\n`;
    chapter.articles.forEach((article, articleIndex) => {
      markdown += `\n### ${chapterIndex + 1}.${articleIndex + 1} - ${
        article.title
      }\n`;
      article.sections.forEach((section, sectionIndex) => {
        markdown += `\n#### ${chapterIndex + 1}.${articleIndex + 1}.${
          sectionIndex + 1
        } - ${section.title}\n`;
        markdown += `\n${section.content}\n`;
      });
    });
  });
  return markdown;
};
export {start, toMarkdown};
