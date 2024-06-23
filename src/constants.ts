import * as path from 'path';
import {pkg} from './pkg';
import * as os from 'os';

const BOOK_OUTPUT_DIR = path.resolve(os.homedir(), `.${pkg.name}`, 'books');
const IDEA_OUTPUT_DIR = path.resolve(os.homedir(), `.${pkg.name}`, 'ideas');

export {BOOK_OUTPUT_DIR, IDEA_OUTPUT_DIR};
