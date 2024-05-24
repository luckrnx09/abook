import {z} from 'zod';

const IdeaSchema = z.object({
  language: z.string(),
  title: z.string(),
  audience: z.string(),
  summary: z.string(),
  topics: z.array(z.string()),
});
export {IdeaSchema};
