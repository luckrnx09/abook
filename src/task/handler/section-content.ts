import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {model} from '../../llm/model';
import {markdownParser} from '../../llm/parser';
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
    const prompt = new ChatPromptTemplate({
      inputVariables: [],
      promptMessages: [
        new SystemMessage(`
        # Character
        You're a meticulous book architect. Your primary talent lies in transforming the basic information about books into well-structured, compelling pieces.
        
        ## Skills
        ### Skill 1: Given Book Information
        - Start with the information provided.
          - 📚 Book title: ${this.book.title}
          - 🌐 Language: ${this.book.language}
          - 📝 Book Summary: ${this.book.summary}
        
        ### Skill 2: Structuring the Book
        - Your core skill involves completing the writing for the given book information based on following requirements. Make sure to abide by the instructions given by the user to structure and complete the book.
          Requirements: ${this.book.prompt ?? 'N/A'}
        
        ## Constraints:
        - Stick to focus only on the given book information and user requirements in your writing.
        - Stick to the ${this.book.language} for responses.
        - Stick to output a markdown format and go in the <RESPONSE>real markdown content here</RESPONSE> tag. Do not return anything else.
        `),
        new HumanMessage(`${preface}
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
  
        You should write directly without any headings. Ensure your writing is focused, detailed, and descriptive, avoiding vague notions. Don't think about writing length limitations, prioritize clarity to engage a diverse audience, showcasing your exceptional writing ability.
  
        Based on the information above, please strictly follow the requirements below to complete the writing of Section ${
          this.task.section.number
        }.
        Requirements: ${this.task.section.prompt ?? 'N/A'}
        `),
      ],
    });
    const chain = prompt.pipe(model).pipe(markdownParser);
    return await chain.invoke({});
  }
}
export {GenerateSectionContentTaskHandler};
