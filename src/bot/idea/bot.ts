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
import {logger} from '../../util/logger';

const start = async (idea: z.infer<typeof IdeaSchema>) => {
  const schemaFile = path.resolve(process.cwd(), 'src/types/books.ts');
  const schema = await fs.readFile(schemaFile, {encoding: 'utf-8'});
  const prompt = new ChatPromptTemplate({
    inputVariables: [],
    promptMessages: [
      new SystemMessage(bookSchemer(idea.language)),
      new HumanMessage(
        `
        \nHere's the BookSchema:
\`\`\`typescript
${schema}
\`\`\`
        \nHere's the information about the book:\n\`\`\`json\n${JSON.stringify(
          idea,
          null,
          2
        )}\n\`\`\`\n`
      ),
    ],
  });
  const chain = prompt.pipe(model).pipe(markdownParser);
  let outline = '';
  try {
    logger.info(
      '🕐 Generating outline for the book, it may take a few minutes'
    );
    outline = await chain.invoke({});
  } catch (error) {
    logger.error(
      new Error(
        `❌ Failed to generate outline. Error: ${(error as Error).message}`
      )
    );
    throw error;
  }
  logger.info('🔍 Validating outline schema');
  try {
    const validatedOutline = BookSchema.parse(JSON.parse(outline));
    logger.info('✅ Outline is valid');
    return validatedOutline;
  } catch (error) {
    logger.error(
      new Error(
        '❌ Outline generated from AI not matched the data schema, please try again'
      )
    );
    throw error;
  }
};

export {start};
