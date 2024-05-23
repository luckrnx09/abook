import {GenerateSectionContentTask} from '../../types';
import {BaseHandler} from './base';

import {ChatPromptTemplate} from '@langchain/core/prompts';

class GenerateSectionContentTaskHandler extends BaseHandler<GenerateSectionContentTask> {
  async exec(): Promise<string> {
    const preface =
      this.task.summaries.chapters.length > 0
        ? `\n      You have already written covered several chapters but your current focus is on a particular section.
      Below is an overview of each chapter that you have already completed:
    ${this.task.summaries.chapters
      .map(c => `\t - Chapter ${c.number}: ${c.summary}`)
      .join('\n')}\n`
        : '';
    const completedSections =
      this.task.summaries.previousSectionsOfCurrentArticle.length > 0
        ? `
        - The sections of the article that have been completed:
    ${this.task.summaries.previousSectionsOfCurrentArticle
      .map(s => `\t  - Section ${s.number}: ${s.summary}`)
      .join('\n')}`
        : '';
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', this.rigid],
      [
        'user',
        `${preface}
      You are currently in Chapter ${this.task.chapter.number}, Article ${
        this.task.article.number
      }, Section ${
        this.task.section.number
      }, and the information for this section is as follows:
        - The title of the chapter to which the article belongs: ${
          this.task.chapter.title
        }
        - The title of the article: ${
          this.task.article.title
        }${completedSections}
        - The title for the section you need to write is: ${
          this.task.section.title
        }
        
      Based on the information above, please strictly follow the requirements below to complete the writing of Section ${
        this.task.section.number
      }.
      Requirements: ${this.task.section.prompt ?? 'N/A'}
      `,
      ],
    ]);
    const prompt = await promptTemplate.invoke({});
    console.log(prompt.messages[1].content);
    return 'generated section content!';
  }
}
export {GenerateSectionContentTaskHandler};
