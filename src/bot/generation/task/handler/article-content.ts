import {AIMessage, HumanMessage, SystemMessage} from '@langchain/core/messages';
import {model} from '../../../../chain/model';
import {markdownParser} from '../../../../chain/parser';
import {GenerateArticleContentTask} from '../../../../types';
import {BaseHandler} from './base';

import {ChatPromptTemplate} from '@langchain/core/prompts';
import {writer} from '../prompt/writer';
import {logger} from '../../../../util/logger';

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
Here is the book information:
- 📚 Book title: ${this.book.title}
- 🌐 Language: ${this.book.language}

${preface}
You are currently in Chapter ${this.task.chapter.number}, Article ${
          this.task.article.number
        }. The information for the article you're writing is as follows:
- It belongs to ${this.task.chapter.title} chapter${previousArticles}
- Article title: ${this.task.article.title}
  
Here are the extra requirements for writing:
- Requirements: ${
          this.task.article.prompt?.length ? this.task.article.prompt : 'N/A'
        }

Please start writing the first paragraph of this article.
        `),
      ],
    });

    let content = '';
    let currentParagraph = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const chain = prompt.pipe(model).pipe(markdownParser);
      const paragraph = await chain.invoke({});
      if (paragraph.trim() === 'DONE' || currentParagraph >= 10) {
        break;
      } else {
        content += '\n' + paragraph;
        prompt.promptMessages.push(
          new AIMessage(`<RESPONSE>${paragraph}</RESPONSE>`)
        );
        prompt.promptMessages.push(new HumanMessage('Continue writing'));
      }
      logger.info(
        `⏳ Writing paragraph ${currentParagraph + 1} of ${
          this.task.article.title
        }`
      );
      currentParagraph++;
    }
    return content;
  }
}
export {GenerateArticleContentTaskHandler};
