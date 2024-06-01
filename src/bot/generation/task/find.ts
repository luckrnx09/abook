import {z} from 'zod';
import {BookSchema, Task} from '../../../types';

const hasValue = (str: string | undefined) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const findNextTask = (book: z.infer<typeof BookSchema>): Task | null => {
  for (const chapter of book.chapters) {
    const chapterIndex = book.chapters.indexOf(chapter);
    for (const article of chapter.articles) {
      const articleIndex = chapter.articles.indexOf(article);
      if (!hasValue(article.content)) {
        return {
          type: 'article-content',
          summaries: {
            chapters: book.chapters
              .filter((_, i) => i < chapterIndex)
              .map((c, i) => ({
                number: i + 1,
                summary: c.summary,
              })),
          },
          previousArticlesOfCurrentChapter: chapter.articles
            .filter((_, i) => i < articleIndex)
            .map((a, i) => ({
              number: i + 1,
              title: a.title,
            })),
          chapter: {
            number: chapterIndex + 1,
            ...chapter,
          },
          article: {
            number: articleIndex + 1,
            ...article,
          },
          path: `/chapters/${chapterIndex}/articles/${articleIndex}/content`,
        };
      }
      if (!hasValue(article.summary)) {
        return {
          type: 'article-summary',
          article: {
            number: articleIndex,
            content: article.content,
          },
          path: `/chapters/${chapterIndex}/articles/${articleIndex}/summary`,
        };
      }
    }
    if (!hasValue(chapter.summary)) {
      return {
        type: 'chapter-summary',
        summaries: {
          articles: chapter.articles.map((a, i) => ({
            number: i + 1,
            summary: a.summary as string,
          })),
        },
        path: `/chapters/${chapterIndex}/summary`,
      };
    }
  }
  return null;
};

export {findNextTask};
