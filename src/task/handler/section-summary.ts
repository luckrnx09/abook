import {ChatPromptTemplate} from '@langchain/core/prompts';
import {GenerateSectionSummaryTask} from '../../types';
import {BaseHandler} from './base';
import {model} from '../../llm/model';
import {markdownParser} from '../../llm/parser';
import {SystemMessage, HumanMessage} from '@langchain/core/messages';

class GenerateSectionSummaryTaskHandler extends BaseHandler<GenerateSectionSummaryTask> {
  async exec(): Promise<string> {
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(
          '  Process text and stick to output a markdown format based on user-specified content length limits, go in the <RESPONSE>real markdown content here</RESPONSE> tag. Do not return anything else.'
        ),
        new HumanMessage(
          `  Give a section content of the article, you can summarize with ${
            this.book.language
          } in no more than 40 words.\n  Here's what you need to summarize:\n  ${this.task.content
            .replace(/\n/g, '')
            .trim()}\n`
        ),
      ],
    });
    const chain = prompt.pipe(model).pipe(markdownParser);
    return (await chain.invoke({})).replace('/\n/g', '');
  }
}
export {GenerateSectionSummaryTaskHandler};
