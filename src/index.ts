import {start, toMarkdown} from './bot';
import {prepareBook} from './bridge';
import {logger} from './logger';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  await start(book);
  // const md = toMarkdown(book);
  // logger.info(md);
})();
