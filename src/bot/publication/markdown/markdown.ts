import {z} from 'zod';
import {BookSchema} from '../../../types';

const markdown = (book: z.infer<typeof BookSchema>) => {
  let markdown = `\n# ${book.title}\n${book.author}\n`;
  book.chapters.forEach((chapter, chapterIndex) => {
    markdown += `\n## ${chapterIndex + 1} - ${chapter.title}\n`;
    chapter.articles.forEach((article, articleIndex) => {
      markdown += `\n### ${chapterIndex + 1}.${articleIndex + 1} - ${
        article.title
      }\n${article.content}\n`;
    });
  });
  return markdown;
};

export {markdown};
