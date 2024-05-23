import {GenerateSectionSummaryTask} from '../../types';
import {BaseHandler} from './base';

class GenerateSectionSummaryTaskHandler extends BaseHandler<GenerateSectionSummaryTask> {
  async exec(): Promise<string> {
    return 'generated section summary!';
  }
}
export {GenerateSectionSummaryTaskHandler};
