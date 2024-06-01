import {Argument, Command} from 'commander';
import {existsSync} from 'fs';
import * as path from 'path';
import {prepareBook} from '../../bot/generation/bridge';
import {BOOK_OUTPUT_DIR} from '../../constants';
import {pkg} from '../../pkg';
import {BookSchema} from '../../types';
import {logger} from '../../util/logger';
import {ensureDirCreated, getIdea} from '../utils';
import * as markdownBot from '../../bot/publication/markdown/bot';

const command = new Command('publish')
  .addArgument(new Argument('idea'))
  .description('convert book content to markdown')
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

    const bookId = ideaData.outline.id;
    if (!existsSync(path.resolve(BOOK_OUTPUT_DIR, bookId, 'generated.json'))) {
      logger.error(
        new Error(
          `❌ Book not generated, please run \`${pkg.name} run ${idea}\` first`
        )
      );
      return;
    }
    const book = await prepareBook(BookSchema.parse(ideaData.outline));
    markdownBot.start(book);
  });

export {command};
