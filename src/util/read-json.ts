import * as fs from 'fs/promises';

const readJSON = async <T extends object>(fileName: string) => {
  const data = await fs.readFile(fileName, {encoding: 'utf-8'});
  return JSON.parse(data) as T;
};

export {readJSON};
