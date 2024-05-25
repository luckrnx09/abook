import {Argument, Command} from 'commander';
import {confirm, input, select} from '@inquirer/prompts';
import {IdeaSchema} from '../types';
import * as fs from 'fs/promises';
import {existsSync, stat} from 'fs';
import {IDEA_OUTPUT_DIR} from '../constants';
import * as path from 'path';
import {Table} from 'console-table-printer';
import {readJSON} from '../util/read-json';
import {z} from 'zod';
import * as ideaBot from '../bot/idea/bot';
import * as generationBot from '../bot/generation/bot';
import {pkg} from '../pkg';
import {logger} from '../util/logger';
const FILE_EXTENSION = '.idea';

const ensureDirCreated = async () => {
  if (!existsSync(IDEA_OUTPUT_DIR)) {
    await fs.mkdir(IDEA_OUTPUT_DIR, {recursive: true});
  }
};
const getIdeaList = async () => {
  const files = await fs.readdir(IDEA_OUTPUT_DIR);
  const ideas = await Promise.all(
    files
      .filter(file => file.endsWith(FILE_EXTENSION))
      .map(async fileName => {
        const fullFileName = path.resolve(IDEA_OUTPUT_DIR, fileName);
        return {
          name: fileName.replace(FILE_EXTENSION, ''),
          created: (await fs.stat(fullFileName)).ctimeMs,
        };
      })
  );
  return ideas
    .sort((a, b) => a.created - b.created)
    .map(idea => ({
      ...idea,
      created: new Date(idea.created).toLocaleString(),
    }));
};
const getIdea = async (idea: string) => {
  const ideas = await getIdeaList();
  const ideaItem = ideas.find(i => i.name === idea) ?? null;
  if (ideaItem === null) return null;
  return IdeaSchema.parse(
    await readJSON(
      path.resolve(IDEA_OUTPUT_DIR, `${ideaItem.name}${FILE_EXTENSION}`)
    )
  );
};

const createIdeaCommand = new Command('new')
  .description('create an idea')
  .action(async () => {
    await ensureDirCreated();
    let name = await input({
      message: 'Enter your idea name',
      validate: value => {
        if (value.trim().length < 2) {
          return 'The length of the name must be greater than 1';
        }
        return true;
      },
    });
    name = name.replace(/\s+/g, '-');
    const ideas = await getIdeaList();
    if (ideas.some(i => i.name === name)) {
      logger.error(new Error('❌ The idea already exists.'));
      return;
    }
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
        message: 'Type your custom language for the book',
        validate: value => {
          return value !== '';
        },
      });
    }
    const audience = await input({
      message: 'Describe the target audience for the book',
      validate: value => value.trim() !== '',
      default: 'N/A',
    });
    const summary = await input({
      message:
        'Provide summary information about the book between 50 and 100 words',
      validate: value => {
        const finalValue = value.trim();
        if (finalValue === '') {
          return 'Summary is required, which will affect the quality of the book outline generated by AI';
        }
        if (finalValue.length < 50 || finalValue.length > 100) {
          return 'The summary should be between 50 and 100 words';
        }
        return true;
      },
    });
    const extractTopics = (topics: string) =>
      topics
        .replace(/，/g, ',')
        .split(',')
        .map(x => x.trim())
        .filter(x => Boolean(x));

    const topics = await input({
      message:
        'What topics need to be included in the book? Separate them by commas(,)',
      validate: value => {
        if (value.trim() === '') {
          return 'Topics is required, which will affect the quality of the book outline generated by AI';
        }
        const count = extractTopics(value).length;
        if (count < 4 || count > 12) {
          return 'You need to provide 4-12 topics in order for the AI to generate a reasonable outline';
        }
        return true;
      },
    });

    const idea = IdeaSchema.parse({
      title: name,
      language,
      audience,
      summary,
      topics: extractTopics(topics),
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
    logger.info('🎉 Idea created successfully');
  });

const removeIdeaCommand = new Command('rm')
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

const listIdeaCommand = new Command('ls')
  .description('list all the ideas')
  .action(async () => {
    await ensureDirCreated();
    const ideas = await getIdeaList();
    const table = new Table({
      title: '\nData Stored in:\n' + IDEA_OUTPUT_DIR,
      columns: [
        {
          name: 'name',
          alignment: 'left',
        },
        {
          name: 'created',
          alignment: 'left',
        },
      ],
      rows: ideas,
    });
    table.printTable();
  });

const generateOutlineCommand = new Command('outline')
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

const generateBookCommand = new Command('run')
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

const commands: Command[] = [
  createIdeaCommand,
  removeIdeaCommand,
  listIdeaCommand,
  generateOutlineCommand,
  generateBookCommand,
];
export {commands};
