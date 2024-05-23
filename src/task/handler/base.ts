import {Task} from '../../types';

abstract class BaseHandler<T extends Task> {
  constructor(
    protected task: T,
    protected rigid: string
  ) {
    this.task = task;
    this.rigid = rigid;
  }

  abstract exec(): Promise<string>;
}
export {BaseHandler};
