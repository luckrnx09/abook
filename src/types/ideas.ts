import {z} from 'zod';
import {BookSchema} from './books';

const IdeaSchema = z.object({
  language: z.string(),
  title: z.string(),
  prompt: z.string(),
  summary: z.string(),
  outline: z.optional(BookSchema),
});
export {IdeaSchema};
