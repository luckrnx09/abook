import {ChatPromptTemplate} from '@langchain/core/prompts';
import {GenerateArticleSummaryTask} from '../../../../types';
import {BaseHandler} from './base';
import {model} from '../../../../chain/model';
import {markdownParser} from '../../../../chain/parser';
import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {summarizer} from '../prompt/summarizer';

class GenerateArticleSummaryTaskHandler extends BaseHandler<GenerateArticleSummaryTask> {
  async exec(): Promise<string> {
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(summarizer(this.book.language, 40)),
        new HumanMessage(
          `
\nHere's what you need to summarize:\n---\n${this.task.article.content}\n`
        ),
      ],
    });
    const chain = prompt.pipe(model).pipe(markdownParser);
    return (await chain.invoke({})).replace(/\n/g, '');
  }
}
export {GenerateArticleSummaryTaskHandler};
