import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {IDEA_OUTPUT_DIR} from '../constants';
import * as path from 'path';
import {IdeaSchema} from '../types';
import {readJSON} from '../util/read-json';
const FILE_EXTENSION = '.idea';

const ensureDirCreated = async () => {
  if (!existsSync(IDEA_OUTPUT_DIR)) {
    await fs.mkdir(IDEA_OUTPUT_DIR, {recursive: true});
  }
};
const getIdeaList = async () => {
  const files = await fs.readdir(IDEA_OUTPUT_DIR);
  const ideas = await Promise.all(
    files
      .filter(file => file.endsWith(FILE_EXTENSION))
      .map(async fileName => {
        const fullFileName = path.resolve(IDEA_OUTPUT_DIR, fileName);
        return {
          name: fileName.replace(FILE_EXTENSION, ''),
          created: (await fs.stat(fullFileName)).ctimeMs,
        };
      })
  );
  return ideas
    .sort((a, b) => a.created - b.created)
    .map(idea => ({
      ...idea,
      created: new Date(idea.created).toLocaleString(),
    }));
};
const getIdea = async (idea: string) => {
  const ideas = await getIdeaList();
  const ideaItem = ideas.find(i => i.name === idea) ?? null;
  if (ideaItem === null) return null;
  return IdeaSchema.parse(
    await readJSON(
      path.resolve(IDEA_OUTPUT_DIR, `${ideaItem.name}${FILE_EXTENSION}`)
    )
  );
};

export {ensureDirCreated, getIdea, getIdeaList, FILE_EXTENSION};
