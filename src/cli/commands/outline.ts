import {Argument, Command} from 'commander';
import * as path from 'path';
import {IDEA_OUTPUT_DIR} from '../../constants';
import {pkg} from '../../pkg';
import {logger} from '../../util/logger';
import {ensureDirCreated, getIdea, FILE_EXTENSION} from '../utils';
import * as fs from 'fs/promises';
import * as ideaBot from '../../bot/idea/bot';

const command = new Command('outline')
  .addArgument(new Argument('idea'))
  .description('generate outline from an idea')
  .action(async (idea: string) => {
    await ensureDirCreated();
    const ideaData = await getIdea(idea);
    if (ideaData === null) {
      logger.error(new Error('❌ Idea not exists'));
      return;
    }
    if (ideaData.outline) {
      logger.error(new Error('❌ Outline has been generated'));
      return;
    }
    ideaData.outline = await ideaBot.start(ideaData);
    const fileName = path.resolve(IDEA_OUTPUT_DIR, `${idea}${FILE_EXTENSION}`);
    await fs.writeFile(fileName, JSON.stringify(ideaData, null, 2), {
      encoding: 'utf-8',
    });
    logger.info('🎉 Outline generate successfully');
    logger.info(
      `Open ${fileName} for secondary adjustment then run \`${pkg.name} run ${idea}\` to generate the book content`
    );
  });

export {command};
