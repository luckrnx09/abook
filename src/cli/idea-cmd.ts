import {Argument, Command} from 'commander';
import {confirm, input, select} from '@inquirer/prompts';
import {IdeaSchema} from '../types';
import * as fs from 'fs/promises';
import {existsSync} from 'fs';
import {IDEA_OUTPUT_DIR} from '../constants';
import * as path from 'path';
import {logger} from '../logger';

const FILE_EXTENSION = '.idea';

const ensureDirCreated = async () => {
  if (!existsSync(IDEA_OUTPUT_DIR)) {
    await fs.mkdir(IDEA_OUTPUT_DIR, {recursive: true});
  }
};
const getIdeaList = async () => {
  const files = await fs.readdir(IDEA_OUTPUT_DIR);
  return files
    .filter(file => file.endsWith(FILE_EXTENSION))
    .map(f => f.replace(FILE_EXTENSION, ''));
};

const createIdeaCommand = new Command('new')
  .addArgument(new Argument('name').argOptional())
  .description('Create an idea from scratch')
  .action(async (name: string) => {
    await ensureDirCreated();
    if (!name) {
      name = await input({
        message: 'Enter your idea name',
        validate: value => {
          if (value.trim().length <= 10) {
            return 'Name of the idea length must be greater than 10';
          }
          return true;
        },
      });
    }
    name = name.replace(/\s+/g, '-');
    const ideas = await getIdeaList();
    if (ideas.includes(name)) {
      logger.error(new Error('The idea already exists.'));
      return;
    }
    console.log(ideas);
    let language = await select({
      message: "What's the book language?",
      choices: [
        {
          name: 'English',
          value: 'en-US',
        },
        {
          name: 'Chinese',
          value: 'zh-CN',
        },
        {
          name: 'Other',
          value: 'other',
        },
      ],
      default: 'en-US',
    });
    if (language === 'other') {
      language = await input({
        message: 'Type your language',
        validate: value => {
          return value !== '';
        },
      });
    }
    const audience = await input({
      message: 'Describe the target audience for this book',
      validate: value => value !== '',
      default: 'N/A',
    });
    const summary = await input({
      message: 'Describe the summary for this book',
      validate: value => value !== '',
      default: 'N/A',
    });
    const topics = await input({
      message: 'Describe the topics for this book, separate them by commas',
      validate: value => value !== '',
      default: 'N/A',
    });
    const idea = IdeaSchema.parse({
      title: name,
      language,
      audience,
      summary,
      topics: topics
        .replace(/，/g, ',')
        .split(',')
        .map(x => x.trim())
        .filter(x => Boolean(x)),
    });

    const confirmed = confirm({
      message: `Confirm your idea: \n - name: ${idea.title}\n - language: ${idea.language}\n - audience: ${idea.audience}\n - summary: ${idea.summary}\n - topics: ${idea.topics}\n`,
    });
    if (!(await confirmed)) {
      confirmed.cancel();
      return;
    }
    await fs.writeFile(
      path.resolve(IDEA_OUTPUT_DIR, `${name}${FILE_EXTENSION}`),
      JSON.stringify(idea, null, 2),
      {encoding: 'utf-8'}
    );
    logger.info('Idea created successfully');
  });

const removeIdeaCommand = new Command('rm')
  .addArgument(new Argument('name'))
  .description('Remove an idea')
  .action(async (name: string) => {
    await ensureDirCreated();
    const ideas = await getIdeaList();
    if (ideas.includes(name)) {
      await fs.rm(path.resolve(IDEA_OUTPUT_DIR, `${name}${FILE_EXTENSION}`));
    } else {
      logger.error(new Error(`Idea ${name} not exists.`));
    }
  });

const listIdeaCommand = new Command('ls')
  .description('List all the ideas')
  .action(async () => {
    await ensureDirCreated();
    const ideas = await getIdeaList();
    console.log(ideas.join('\n'));
  });

const ideaCommand = new Command('idea')
  .description('Manage ideas')
  .addCommand(createIdeaCommand)
  .addCommand(removeIdeaCommand)
  .addCommand(listIdeaCommand);

export {ideaCommand};
