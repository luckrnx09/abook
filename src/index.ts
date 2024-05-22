import { Composer } from './composer';
import {prepareBook} from './meta';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
    //   console.log(JSON.stringify(book, null, 2));
    const composer = new Composer(book);
    composer.continueToWrite();
})();
