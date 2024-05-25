import * as fs from 'fs/promises';
import { z } from 'zod';
import { BookSchema } from '../../../types';
import { markdown } from './markdown';
import * path from 'path';
import { BOOK_OUTPUT_DIR } from '../../../constants';
import { logger } from '../../../util/logger';

const start = async (book: z.infer<typeof BookSchema>) => { 
    const content = markdown(book);
    const fileName = path.resolve(BOOK_OUTPUT_DIR, book.id, `${book.title}.md`);
    await fs.writeFile(fileName, content, { encoding: 'utf-8' });
    logger.info(`🎉 The books have been converted to markdown format and stored location:\n${fileName}`);
}

export { start }