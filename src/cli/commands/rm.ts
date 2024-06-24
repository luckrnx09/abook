import {Command, Argument} from 'commander';
import * as path from 'path';
import {IDEA_OUTPUT_DIR} from '../../constants';
import {logger} from '../../util/logger';
import {ensureDirCreated, getIdeaList, FILE_EXTENSION} from '../utils';
import * as fs from 'fs/promises';

const command = new Command('rm')
  .addArgument(new Argument('idea'))
  .description('remove an idea')
  .action(async (idea: string) => {
    await ensureDirCreated();
    const ideas = await getIdeaList();
    if (ideas.some(i => i.name === idea)) {
      await fs.rm(path.resolve(IDEA_OUTPUT_DIR, `${idea}${FILE_EXTENSION}`));
    } else {
      logger.error(new Error(`❌ Idea ${idea} not exists.`));
    }
  });
export {command};
