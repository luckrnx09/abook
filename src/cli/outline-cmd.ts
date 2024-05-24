import {Command, program} from 'commander';

const createOutlineCommand = new Command('new <idea>')
  .description('Generate a draft outline from an idea')
  .action((idea: string, outline?: string) => {
    console.log('generate outlines', idea, outline);
  });

const runOutlineCommand = new Command('run <outline>')
  .description(
    'Run or continue to do the task for generating the book from the outline'
  )
  .action((outline: string) => {
    console.log('generate book', outline);
  });

const outlineCommand = new Command('outline')
  .description('Manage outlines')
  .addCommand(createOutlineCommand)
  .addCommand(runOutlineCommand);

export {outlineCommand};
