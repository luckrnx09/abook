import {Command, program} from 'commander';

const createIdeaCommand = new Command('new <name>')
  .description('Create an idea from scratch')
  .action((name: string) => {
    console.log('create idea' + name);
  });

const removeIdeaCommand = new Command('rm <name>')
  .description('Remove an idea')
  .action((name: string) => {
    console.log('remove idea' + name);
  });

const listIdeaCommand = new Command('ls')
  .description('List all the ideas')
  .action(() => {
    console.log('list ideas');
  });

const ideaCommand = new Command('idea')
  .description('Manage ideas')
  .addCommand(createIdeaCommand)
  .addCommand(removeIdeaCommand)
  .addCommand(listIdeaCommand);

export {ideaCommand};
