import {prepareBook} from './meta';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  const book = await prepareBook(metaFile);
  console.log(book);
})();
