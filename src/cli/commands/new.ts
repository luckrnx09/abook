import {Command} from 'commander';
import {FILE_EXTENSION, ensureDirCreated, getIdeaList} from '../utils';
import {confirm, input, select} from '@inquirer/prompts';
import {IDEA_OUTPUT_DIR} from '../../constants';
import {IdeaSchema} from '../../types';
import {logger} from '../../util/logger';
import * as fs from 'fs/promises';
import * as path from 'path';
const command = new Command('new')
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

    const idea = IdeaSchema.parse({
      title: name,
      language,
      audience,
      summary,
    });

    const confirmed = confirm({
      message: `Confirm your idea: \n - name: ${idea.title}\n - language: ${idea.language}\n - audience: ${idea.audience}\n - summary: ${idea.summary}\n`,
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

export {command};
