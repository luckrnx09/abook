import {z} from 'zod';

const OutlineSchema = z.object({
  chapters: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      articles: z.array(
        z.object({
          slug: z.string(),
          title: z.string(),
        })
      ),
    })
  ),
});
export {OutlineSchema};
