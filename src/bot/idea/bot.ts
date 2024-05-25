import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import * as fs from 'fs/promises';
import * as path from 'path';
import {bookSchemer} from './prompt/book-schemer';
import {z} from 'zod';
import {IdeaSchema} from '../../types';
import {BookSchema} from '../../types';
import {model} from '../../chain/model';
import {markdownParser} from '../../chain/parser';

const start = async (idea: z.infer<typeof IdeaSchema>) => {
  const schemaFile = path.resolve(process.cwd(), 'src/types/books.ts');
  const schema = await fs.readFile(schemaFile, {encoding: 'utf-8'});
  const prompt = new ChatPromptTemplate({
    inputVariables: [],
    promptMessages: [
      new SystemMessage(bookSchemer(schema, idea.language)),
      new HumanMessage(
        `
        \nHere's the information about the book:\n\`\`\`json\n${JSON.stringify(
          idea,
          null,
          2
        )}\n\`\`\`\n`
      ),
    ],
  });
  const chain = prompt.pipe(model).pipe(markdownParser);
  const outline = await chain.invoke({});
  return BookSchema.parse(outline);
};

export {start};
