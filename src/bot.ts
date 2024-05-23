import {z} from 'zod';
import {BookSchema} from './types';
import {logger} from './logger';
import {Task} from './types';
import {executeTask} from './task';
import {findNextTask} from './task/find';
import * as jsonpatch from 'fast-json-patch';
import {persistBook} from './bridge';

export class Bot {
  constructor(private book: z.infer<typeof BookSchema>) {
    this.book = book;
  }
  run = async (interval = 5000) => {
    const sleep = (ms: number) =>
      new Promise(resolve => {
        setInterval(resolve, ms);
      });
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const task = findNextTask(this.book);
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
      const newBook = jsonpatch.applyPatch(this.book, [
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
      this.book = newBook;
      await sleep(5000);
    }
    logger.info('🎉 Congratulations! Book is finished');
  };
}
