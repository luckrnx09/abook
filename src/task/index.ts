import {Task, TaskResult} from '../types';

const executeTask = async (task: Task): Promise<TaskResult> => {
  try {
    return {
      error: null,
      content: 'hello',
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
