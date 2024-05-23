import {GenerateArticleSummaryTask} from '../../types';
import {BaseHandler} from './base';

class GenerateArticleSummaryTaskHandler extends BaseHandler<GenerateArticleSummaryTask> {
  async exec(): Promise<string> {
    return 'N/A';
  }
}
export {GenerateArticleSummaryTaskHandler};
