import * as path from 'path';
const pkg = require('../package.json');

export const BOOK_OUTPUT_DIR = path.resolve(
  process.cwd(),
  `.${pkg.name}`,
  'books'
);
export const IDEA_OUTPUT_DIR = path.resolve(
  process.cwd(),
  `.${pkg.name}`,
  'ideas'
);
export const OUTLINE_OUTPUT_DIR = path.resolve(
  process.cwd(),
  `.${pkg.name}`,
  'outlines'
);
