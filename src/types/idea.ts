import {z} from 'zod';
import {BookSchema} from './books';

const IdeaSchema = z.object({
  language: z.string(),
  title: z.string(),
  audience: z.string(),
  summary: z.string(),
  topics: z.array(z.string()),
  outline: z.optional(BookSchema),
});
export {IdeaSchema};
