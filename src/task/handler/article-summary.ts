import {ChatPromptTemplate} from '@langchain/core/prompts';
import {GenerateArticleSummaryTask} from '../../types';
import {BaseHandler} from './base';
import {model} from '../../llm/model';
import {markdownParser} from '../../llm/parser';
import {HumanMessage, SystemMessage} from '@langchain/core/messages';

class GenerateArticleSummaryTaskHandler extends BaseHandler<GenerateArticleSummaryTask> {
  async exec(): Promise<string> {
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(
          '  Process text and stick to output a markdown format based on user-specified content length limits, go in the <RESPONSE>real markdown content here</RESPONSE> tag. Do not return anything else.'
        ),
        new HumanMessage(
          `\n  Gives you a list that describes each section of the article, you can summarize with ${
            this.book.language
          } in no more than 40 words.\n  Here's what you need to summarize:\n  ${this.task.summaries.sections
            .map(s => `  ${s.number}. ${s.summary.replace(/\n/g, '')}`)
            .join('\n  ')}\n`
        ),
      ],
    });
    const chain = prompt.pipe(model).pipe(markdownParser);
    return (await chain.invoke({})).replace(/\n/g, '');
  }
}
export {GenerateArticleSummaryTaskHandler};
