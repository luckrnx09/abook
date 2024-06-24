import {Argument, Command} from 'commander';
import {logger} from '../../util/logger';
import {ensureDirCreated, getIdea} from '../utils';
import * as generationBot from '../../bot/generation/bot';

const command = new Command('run')
  .addArgument(new Argument('idea'))
  .description('generate book content from an idea with outline')
  .action(async (idea: string) => {
    await ensureDirCreated();
    const ideaData = await getIdea(idea);
    if (ideaData === null) {
      logger.error(new Error('❌ Idea not exists'));
      return;
    }
    if (!ideaData.outline) {
      logger.error(
        new Error(
          '❌ There is no outline generated for this idea, run `${pkg.name} outline ${idea}` to generate the outline'
        )
      );
      return;
    }
    await generationBot.start(ideaData.outline);
  });

export {command};
