import {initializeBook} from './meta';

const metaFile = process.cwd() + '/src/example.json';
(async () => {
  await initializeBook(metaFile);
})();
