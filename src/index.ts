import {Bot} from './bot';
import {prepareBook} from './bridge';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  //   console.log(JSON.stringify(book, null, 2));
  const bot = new Bot(book);
  await bot.run();
})();
