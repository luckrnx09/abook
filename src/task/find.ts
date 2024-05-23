import {z} from 'zod';
import {BookSchema, Task} from '../types';

const hasValue = (str: string | undefined) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const findNextTask = (book: z.infer<typeof BookSchema>): Task | null => {
  for (const chapter of book.chapters) {
    const chapterIndex = book.chapters.indexOf(chapter);
    for (const article of chapter.articles) {
      const articleIndex = chapter.articles.indexOf(article);
      /**
       * A completed article should match all the conditions:
       *  - its sections have content
       *  - its sections have summary
       *  - it has summary
       */
      for (const section of article.sections) {
        const sectionIndex = article.sections.indexOf(section);
        if (hasValue(section.content)) {
          if (!hasValue(section.summary)) {
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
              chapters: book.chapters
                .filter((_, i) => i < chapterIndex)
                .map((c, i) => ({
                  number: i + 1,
                  summary: c.summary as string,
                })),
              previousSectionsOfCurrentArticle: article.sections
                .filter((_, i) => i < sectionIndex)
                .map((s, i) => ({
                  number: i + 1,
                  summary: s.summary as string,
                })),
            },
            article: {
              number: articleIndex + 1,
              title: article.title,
            },
            chapter: {
              number: chapterIndex + 1,
              title: chapter.title,
            },
            section: {
              number: sectionIndex + 1,
              ...section,
            },
            path: `/chapters/${chapterIndex}/articles/${articleIndex}/sections/${sectionIndex}/content`,
          };
        }
      }
      if (!hasValue(article.summary)) {
        return {
          type: 'article-summary',
          summaries: {
            sections: article.sections.map(s => s.summary as string),
          },
          path: `/chapters/${chapterIndex}/articles/${articleIndex}/summary`,
        };
      }
    }
    if (!hasValue(chapter.summary)) {
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
};

export {findNextTask};
