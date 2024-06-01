import {Command, program} from 'commander';
import {pkg} from '../pkg';
import {IDEA_OUTPUT_DIR} from '../constants';
import {command as ls} from './commands/ls';
import {command as _new} from './commands/new';
import {command as outline} from './commands/outline';
import {command as publish} from './commands/publish';
import {command as rm} from './commands/rm';
import {command as run} from './commands/run';
const commands: Command[] = [ls, _new, outline, publish, rm, run];

const {name, version} = pkg;
program
  .name(name)
  .description(
    `An AI powered command-line tool for generating any books from scratch\nData Stored in: \n${IDEA_OUTPUT_DIR}`
  )
  .version(version);

commands.forEach(cmd => program.addCommand(cmd));
program.parse(process.argv);
