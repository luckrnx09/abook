import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {ChatPromptTemplate} from '@langchain/core/prompts';
import * as fs from 'fs/promises';
import * as path from 'path';
import {bookSchemer} from './prompt/book-schemer';
import {z} from 'zod';
import {BookSchema, IdeaSchema, OutlineSchema} from '../../types';
import {model} from '../../chain/model';
import {markdownParser} from '../../chain/parser';
import {logger} from '../../util/logger';

const parseBookSchema = (
  outline: z.infer<typeof OutlineSchema>,
  idea: z.infer<typeof IdeaSchema>
): z.infer<typeof BookSchema> => {
  const bookSchema = BookSchema.parse({
    id: idea.title,
    author: '',
    title: idea.title,
    summary: idea.summary,
    language: idea.language,
    prompt: idea.prompt,
    chapters: [],
  });
  outline.chapters.forEach(c => {
    bookSchema.chapters.push({
      id: c.slug,
      title: c.title,
      summary: '',
      articles: c.articles.map(a => ({
        id: a.slug,
        title: a.title,
        prompt: '',
        summary: '',
        slug: a.slug,
        content: '',
      })),
    });
  });
  return bookSchema;
};

const start = async (idea: z.infer<typeof IdeaSchema>) => {
  const schemaFile = path.resolve(process.cwd(), 'src/types/outlines.ts');
  const schema = await fs.readFile(schemaFile, {encoding: 'utf-8'});
  const prompt = new ChatPromptTemplate({
    inputVariables: [],
    promptMessages: [
      new SystemMessage(bookSchemer(idea.language)),
      new HumanMessage(
        `
        \nHere's the \`OutlineSchema\`: 
\`\`\`typescript
${schema}
\`\`\`
        \nHere's the book idea:\n\`\`\`json\n${JSON.stringify(
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
    const validatedOutline = OutlineSchema.parse(JSON.parse(outline));
    logger.info('✅ Outline is valid');
    return parseBookSchema(validatedOutline, idea);
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
