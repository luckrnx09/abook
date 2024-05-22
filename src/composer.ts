import {z} from 'zod';
import {ArticleSchema, BookSchema, SectionSchema} from './types';
import {logger} from './logger';

interface GenerateSectionContentTask {
  type: 'section-content';
  summaries: {
    chapters: string[];
    previousSectionsOfCurrentArticle: string[];
  };
  section: Omit<z.infer<typeof SectionSchema>, 'content'>;
  path: string;
}

interface GenerateSectionSummaryTask {
  type: 'section-summary';
  content: string;
  path: string;
}

interface GenerateArticleSummaryTask {
  type: 'article-summary';
  summaries: {
    sections: string[];
  };
  path: string;
}

interface GenerateChapterSummaryTask {
  type: 'chapter-summary';
  summaries: {
    articles: string[];
  };
  path: string;
}

type WorkInProgressGenerateTask =
  | GenerateSectionContentTask
  | GenerateSectionSummaryTask
  | GenerateArticleSummaryTask
  | GenerateChapterSummaryTask;

const hasGeneratedContent = (str: string | undefined) => {
  return typeof str === 'string' && str.trim().length > 0;
};
export class Composer {
  constructor(private book: z.infer<typeof BookSchema>) {
    this.book = book;
  }
  private getWorkInProgressTask(): WorkInProgressGenerateTask | null {
    for (const chapter of this.book.chapters) {
      const chapterIndex = this.book.chapters.indexOf(chapter);
      for (const article of chapter.articles) {
        const articleIndex = chapter.articles.indexOf(article);
        /**
         * A completed article should be:
         *  - its sections have content
         *  - its sections have summary
         *  - it has summary
         */
        for (const section of article.sections) {
          const sectionIndex = article.sections.indexOf(section);
          if (hasGeneratedContent(section.content)) {
            if (!hasGeneratedContent(section.summary)) {
              return {
                type: 'section-summary',
                content: section.content as string,
                path: `/chapters/${chapterIndex}/articles/${articleIndex}/sections/${sectionIndex}/summary`,
              };
            }
          } else {
            return {
              type: 'section-content',
              summaries: {
                chapters: this.book.chapters
                  .filter((_, i) => i < chapterIndex)
                  .map(c => c.summary as string),
                previousSectionsOfCurrentArticle: article.sections
                  .filter((_, i) => i < sectionIndex)
                  .map(s => s.summary as string),
              },
              section,
              path: `/chapters/${chapterIndex}/articles/${articleIndex}/sections/${sectionIndex}/content`,
            };
          }
        }
        if (!hasGeneratedContent(article.summary)) {
          return {
            type: 'article-summary',
            summaries: {
              sections: article.sections.map(s => s.summary as string),
            },
            path: `/chapters/${chapterIndex}/articles/${articleIndex}/summary`,
          };
        }
      }
      if (!hasGeneratedContent(chapter.summary)) {
        return {
          type: 'chapter-summary',
          summaries: {
            articles: chapter.articles.map(a => a.summary as string),
          },
          path: `/chapters/${chapterIndex}/summary`,
        };
      }
    }
    return null;
  }
  continueToWrite = () => {
    const task = this.getWorkInProgressTask();
    if (task === null) {
      logger.info('Book has been wrote completed.');
    }
    console.log(task);
  };
}
