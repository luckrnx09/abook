import {ChatPromptTemplate} from '@langchain/core/prompts';
import {model} from '../../../../chain/model';
import {markdownParser} from '../../../../chain/parser';
import {GenerateChapterSummaryTask} from '../../../../types';
import {BaseHandler} from './base';
import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {summarizer} from '../prompt/summarizer';

class GenerateChapterSummaryTaskHandler extends BaseHandler<GenerateChapterSummaryTask> {
  async exec(): Promise<string> {
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(summarizer(this.book.language, 60)),
        new HumanMessage(
          `
\nHere's what you need to summarize:\n---\n${this.task.summaries.articles
            .map(s => `- ${s.summary.replace(/\n/g, '')}`)
            .join('\n')}\n`
        ),
      ],
    });
    const chain = prompt.pipe(model).pipe(markdownParser);
    return (await chain.invoke({})).replace(/\n/g, '');
  }
}
export {GenerateChapterSummaryTaskHandler};
