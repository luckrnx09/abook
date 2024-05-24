import {z} from 'zod';
import {BookSchema, Task} from '../../types';

abstract class BaseHandler<T extends Task> {
  constructor(
    protected book: Omit<z.infer<typeof BookSchema>, 'chapters'>,
    protected task: T
  ) {
    this.book = book;
    this.task = task;
  }

  abstract exec(): Promise<string>;
}
export {BaseHandler};
