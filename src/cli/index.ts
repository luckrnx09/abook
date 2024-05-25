import {program} from 'commander';
import {commands} from './commands';
import {pkg} from '../pkg';
import {IDEA_OUTPUT_DIR} from '../constants';

const {name, description, version} = pkg;
program
  .name(name)
  .description(
    `An AI powered tool for generating any books from scratch\nData Stored in: \n${IDEA_OUTPUT_DIR}`
  )
  .version(version);

commands.forEach(cmd => program.addCommand(cmd));
program.parse(process.argv);
