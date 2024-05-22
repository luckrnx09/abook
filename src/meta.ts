import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {BookSchema} from './types';
import {logger} from './logger';
import * as path from 'path';
import {GENERATED_BOOK_OUTPUT_DIR} from './constants';
import {z} from 'zod';
import * as jsonpatch from 'fast-json-patch';

const readFileAsJSON = async <T extends object>(filename: string) => {
  const data = await fs.readFile(filename, {encoding: 'utf-8'});
  return JSON.parse(data) as T;
};

const getGeneratedBookFileName = (boolId: string) => {
  return path.resolve(GENERATED_BOOK_OUTPUT_DIR, boolId, 'book.json');
};

const persistBook = async (book: z.infer<typeof BookSchema>) => {
  const fileName = getGeneratedBookFileName(book.id);
  await fs.writeFile(fileName, JSON.stringify(book, null, 2), {
    encoding: 'utf-8',
  });
};
const getGeneratedBook = async (boolId: string) => {
  const fileName = getGeneratedBookFileName(boolId);
  if (!existsSync(fileName)) {
    await fs.mkdir(path.dirname(fileName), {recursive: true});
    await fs.writeFile(fileName, '{}', {encoding: 'utf-8'});
  }
  const generatedBook = await readFileAsJSON(fileName);
  try {
    const book = BookSchema.parse(generatedBook);
    logger.info('Generated book is valid');
    return book;
  } catch {
    return {} as z.infer<typeof BookSchema>;
  }
};

const merge = (
  meta: z.infer<typeof BookSchema>,
  generated: z.infer<typeof BookSchema>
) => {
  const patch = jsonpatch.compare(meta, generated);
  jsonpatch.applyPatch(
    meta,
    patch.filter(
      x =>
        (x.op === 'add' || x.op === 'replace') &&
        (x.path.endsWith('content') || x.path.endsWith('summary'))
    )
  );
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
  const generatedBook = await getGeneratedBook(book.id);
  merge(book, generatedBook);
  await persistBook(book);
  return book;
};
