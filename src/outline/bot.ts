import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import * as fs from 'fs/promises';
import * as path from 'path';
import {outlineMaster} from './prompt/outline-master';
import {z} from 'zod';
import {IdeaSchema} from '../types';

const start = async (idea: z.infer<typeof IdeaSchema>) => {
  const schemaFile = path.resolve(process.cwd(), '/src/types/books.ts');
  const schema = await fs.readFile(schemaFile, {encoding: 'utf-8'});
  const prompt = new ChatPromptTemplate({
    inputVariables: [],
    promptMessages: [
      new SystemMessage(outlineMaster(schema)),
      new HumanMessage(
        `\nHere's the information about the book:\n\`\`\`json\n${JSON.stringify(
          idea,
          null,
          2
        )}\n\`\`\`\n`
      ),
    ],
  });
  console.log(await prompt.format({}));
};

export {start};
