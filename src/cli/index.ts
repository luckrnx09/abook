import {Command, program} from 'commander';
import {ideaCommand} from './idea-cmd';
import {outlineCommand} from './outline-cmd';
const pkg = require('../../package.json');

const {name, description, version} = pkg;
program
  .name(name)
  .description(description)
  .version(version)
  .addCommand(ideaCommand)
  .addCommand(outlineCommand)
  .parse(process.argv);
