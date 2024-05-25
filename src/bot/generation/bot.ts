import {z} from 'zod';
import {BookSchema} from '../../types';
import {logger} from '../../util/logger';
import {executeTask} from './task/exec';
import {findNextTask} from './task/find';
import * as jsonpatch from 'fast-json-patch';
import {persistBook, prepareBook} from './bridge';
import {sleep} from '../../util/sleep';

const start = async (book: z.infer<typeof BookSchema>) => {
  await prepareBook(book);
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

export {start};
