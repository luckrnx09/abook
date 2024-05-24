import {ChatPromptTemplate} from '@langchain/core/prompts';
import {GenerateSectionSummaryTask} from '../../types';
import {BaseHandler} from './base';
import {model} from '../../llm/model';
import {markdownParser} from '../../llm/parser';

class GenerateSectionSummaryTaskHandler extends BaseHandler<GenerateSectionSummaryTask> {
  async exec(): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '  Process text and stick to output a markdown format and go in the <RESPONSE>real markdown content here</RESPONSE> tag. Do not return anything else.',
      ],
      [
        'user',
        `  Give a section content of the book, you can summarize with ${
          this.language
        } it in no more than 30 words.\n  Please strictly adhere to the word limit.\n  Here's what you need to summarize:\n  ${this.task.content
          .replace(/\n/g, '')
          .trim()}\n`,
      ],
    ]);
    const chain = prompt.pipe(model).pipe(markdownParser);
    return await chain.invoke({});
  }
}
export {GenerateSectionSummaryTaskHandler};
