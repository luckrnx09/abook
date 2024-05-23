import {start} from './bot';
import {prepareBook} from './bridge';
import { configDotenv } from 'dotenv';
configDotenv();

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  await start(book);
})();
