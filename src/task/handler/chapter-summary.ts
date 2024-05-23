import {GenerateChapterSummaryTask} from '../../types';
import {BaseHandler} from './base';

class GenerateChapterSummaryTaskHandler extends BaseHandler<GenerateChapterSummaryTask> {
  async exec(): Promise<string> {
    return 'generated chapter summary!';
  }
}
export {GenerateChapterSummaryTaskHandler};
