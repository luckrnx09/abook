import {z} from 'zod';
import {BookSchema} from './types';
import {logger} from './logger';
import {Task} from './types';
import {executeTask} from './task';
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
    const {error, content} = await executeTask(task);
    if (error) {
      logger.error(
        new Error(`❌ An error occurred while executing the task: ${error}`)
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
export {start};
