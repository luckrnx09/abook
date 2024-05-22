import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {BookSchema, GeneratedArticlesSchema} from './types';
import {logger} from './logger';
import * as path from 'path';
import {GENERATED_BOOK_OUTPUT_DIR} from './constants';
import {z} from 'zod';

const readFileAsJSON = async <T extends object>(filename: string) => {
  const data = await fs.readFile(filename, {encoding: 'utf-8'});
  return JSON.parse(data) as T;
};

const getGeneratedArticlesFileName = (boolId: string) => {
  return path.resolve(GENERATED_BOOK_OUTPUT_DIR, boolId, 'articles.json');
};

const getGeneratedArticles = async (boolId: string) => {
  const fileName = getGeneratedArticlesFileName(boolId);
  if (!existsSync(fileName)) {
    await fs.mkdir(path.dirname(fileName), {recursive: true});
    await fs.writeFile(fileName, '{}', {encoding: 'utf-8'});
  }
  const generatedArticles = await readFileAsJSON(fileName);
  try {
    const articles = GeneratedArticlesSchema.parse(generatedArticles);
    logger.info(
      `Generated article(s) are valid, found ${
        Reflect.ownKeys(articles).length
      }.`
    );
    return articles;
  } catch {
    return {} as z.infer<typeof GeneratedArticlesSchema>;
  }
};

const updateBookArticles = (
  book: z.infer<typeof BookSchema>,
  articles: z.infer<typeof GeneratedArticlesSchema>
) => {
  book.chapters.forEach(chapter => {
    chapter.articles.forEach(article => {
      const generatedArticle = articles[article.id];
      article.sections.forEach(section => {
        section.content = generatedArticle?.[section.id] ?? '';
      });
    });
  });
};

export const prepareBook = async (metaFileName: string) => {
  const meta = await readFileAsJSON(metaFileName);
  let book: z.infer<typeof BookSchema>;
  try {
    book = BookSchema.parse(meta);
    logger.info('Book data is valid');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(new Error(`Invalid book data: ${error.message}`));
    }
    throw error;
  }
  const articles = await getGeneratedArticles(book.id);
  updateBookArticles(book, articles);
  return book;
};
