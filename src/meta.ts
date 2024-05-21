import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {BookSchema, DraftArticlesSchema} from './types';
import {logger} from './logger';
import * as path from 'path';
import {DRAFT_OUTPUT_DIR} from './constants';
import {z} from 'zod';

const readFileAsJSON = async <T extends object>(filename: string) => {
  const data = await fs.readFile(filename, {encoding: 'utf-8'});
  return JSON.parse(data) as T;
};

const getDraftBookMetaFileName = (boolId: string) => {
  return path.resolve(DRAFT_OUTPUT_DIR, boolId, 'articles.json');
};

const getDraftArticles = async (boolId: string) => {
  const targetFileName = getDraftBookMetaFileName(boolId);
  if (!existsSync(targetFileName)) {
    await fs.mkdir(path.dirname(targetFileName), {recursive: true});
    await fs.writeFile(targetFileName, '{}', {encoding: 'utf-8'});
  }
  const draft = await readFileAsJSON(targetFileName);
  try {
    const articles = DraftArticlesSchema.parse(draft);
    logger.info(
      `Draft article(s) are valid, found ${Reflect.ownKeys(articles).length}.`
    );
    return articles;
  } catch {
    return {} as z.infer<typeof DraftArticlesSchema>;
  }
};

const merge = (
  book: z.infer<typeof BookSchema>,
  articles: z.infer<typeof DraftArticlesSchema>
) => {
  book.chapters.forEach(chapter => {
    chapter.articles.forEach(article => {
      const draftArticle = articles[article.id];
      article.sections.forEach(section => {
        section.content = draftArticle?.[section.id] ?? '';
      });
    });
  });
};

export const initializeBook = async (metaFileName: string) => {
  const meta = await readFileAsJSON(metaFileName);
  try {
    const book = BookSchema.parse(meta);
    logger.info('Book data is valid');
    const draft = await getDraftArticles(book.id);
    merge(book, draft);
    return book;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(new Error(`Invalid book data: ${error.message}`));
    }
    throw error;
  }
};
