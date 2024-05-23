import {start, toMarkdown} from './bot';
import {prepareBook} from './bridge';
import {configDotenv} from 'dotenv';
import {logger} from './logger';
configDotenv({override: true});

console.log(process.env.OPENAI_API_KEY);
console.log(process.env.OPENAI_BASE_URL);
const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  await start(book);
  const md = toMarkdown(book);
  logger.info(md);
})();
