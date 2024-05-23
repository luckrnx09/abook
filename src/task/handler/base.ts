import {Task} from '../../types';

abstract class BaseHandler<T extends Task> {
  constructor(
    protected task: T,
    protected rigid: string,
    protected language: string
  ) {
    this.task = task;
    this.rigid = rigid;
    this.language = language;
  }

  abstract exec(): Promise<string>;
}
export {BaseHandler};
