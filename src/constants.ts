import * as path from 'path';
import {pkg} from './pkg';

const BOOK_OUTPUT_DIR = path.resolve(process.cwd(), `.${pkg.name}`, 'books');
const IDEA_OUTPUT_DIR = path.resolve(process.cwd(), `.${pkg.name}`, 'ideas');

export {BOOK_OUTPUT_DIR, IDEA_OUTPUT_DIR};
