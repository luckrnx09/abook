import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {BookSchema} from '../../types';
import {logger} from '../../logger';
import * as path from 'path';
import {BOOK_OUTPUT_DIR} from '../../constants';
import {z} from 'zod';
import * as jsonpatch from 'fast-json-patch';
import {readJSON} from '../../util/read-json';

const getPersistFileName = (boolId: string) => {
  return path.resolve(BOOK_OUTPUT_DIR, boolId, 'generated.json');
};

const getPersistedBook = async (boolId: string) => {
  const fileName = getPersistFileName(boolId);
  if (!existsSync(fileName)) {
    await fs.mkdir(path.dirname(fileName), {recursive: true});
    await fs.writeFile(fileName, '{}', {encoding: 'utf-8'});
  }
  const persistedBook = await readJSON(fileName);
  try {
    const book = BookSchema.parse(persistedBook);
    logger.info('💾 Persisted book data validated successfully');
    return book;
  } catch {
    return {} as z.infer<typeof BookSchema>;
  }
};

const mergeBook = (
  book: z.infer<typeof BookSchema>,
  persistedBook: z.infer<typeof BookSchema>
) => {
  const patch = jsonpatch.compare(book, persistedBook);
  return jsonpatch.applyPatch(
    book,
    patch.filter(
      x =>
        (x.op === 'add' || x.op === 'replace') &&
        (x.path.endsWith('content') || x.path.endsWith('summary'))
    )
  ).newDocument;
};

const prepareBook = async (book: z.infer<typeof BookSchema>) => {
  logger.info(`📚 Preparing book: ${book.title}`);
  const persistedBook = await getPersistedBook(book.id);
  book = mergeBook(book, persistedBook);
  await persistBook(book);
  logger.info('🧩 Book data merged successfully');
  return book;
};

const persistBook = async (book: z.infer<typeof BookSchema>) => {
  const fileName = getPersistFileName(book.id);
  await fs.writeFile(fileName, JSON.stringify(book, null, 2), {
    encoding: 'utf-8',
  });
};

export {prepareBook, persistBook};
