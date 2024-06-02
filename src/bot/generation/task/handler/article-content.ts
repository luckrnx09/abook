import {AIMessage, HumanMessage, SystemMessage} from '@langchain/core/messages';
import {model} from '../../../../chain/model';
import {markdownParser} from '../../../../chain/parser';
import {GenerateArticleContentTask} from '../../../../types';
import {BaseHandler} from './base';

import {ChatPromptTemplate} from '@langchain/core/prompts';
import {writer} from '../prompt/writer';

class GenerateArticleContentTaskHandler extends BaseHandler<GenerateArticleContentTask> {
  async exec(): Promise<string> {
    const preface =
      this.task.summaries.chapters.length > 0
        ? `You have already written covered several chapters but your current focus is on a particular article.
Below is an overview of each chapter that you have already completed:
${this.task.summaries.chapters
  .map(c => `- Chapter ${c.number}: ${c.summary}`)
  .join('\n')}\n`
        : '';
    const previousArticles =
      this.task.previousArticlesOfCurrentChapter.length > 0
        ? `
- The articles of the chapter that have been completed:
${this.task.previousArticlesOfCurrentChapter
  .map(s => `  - ${s.title}`)
  .join('\n')}`
        : '';
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(writer(this.book)),
        new HumanMessage(`
${preface}
You are currently in Chapter ${this.task.chapter.number}, Article ${
          this.task.article.number
        }. The information for this article is as follows:
- The title of the chapter to which the article belongs: ${
          this.task.chapter.title
        }${previousArticles}
- The title for the article you need to write: ${this.task.article.title}
  
You should write directly without any headings. Ensure your writing is focused, detailed, and descriptive, avoiding vague notions. Don't think about writing length limitations, prioritize clarity to engage a diverse audience, showcasing your exceptional writing ability.
  
Based on the information above, please strictly follow the requirements below to complete the article.
Requirements: ${
          this.task.article.prompt?.length ? this.task.article.prompt : 'N/A'
        }
        `),
      ],
    });

    let content = '';
    let currentParagraph = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const chain = prompt.pipe(model).pipe(markdownParser);
      const paragraph = await chain.invoke({});
      if (paragraph === 'DONE' || currentParagraph >= 10) {
        break;
      } else {
        content += '\n' + paragraph;
        prompt.promptMessages.push(
          new AIMessage(`<RESPONSE>${paragraph}</RESPONSE>`)
        );
        prompt.promptMessages.push(new HumanMessage('Continue writing'));
      }
      console.log('currentParagraph', currentParagraph);
      currentParagraph++;
    }
    return content;
  }
}
export {GenerateArticleContentTaskHandler};
