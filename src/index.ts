import {start} from './bot';
import {prepareBook} from './bridge';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  await start(book);
})();
