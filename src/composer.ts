import {z} from 'zod';
import {ArticleSchema, BookSchema} from './types';

interface WorkInProgressTask { 
    article: Omit<z.infer<typeof ArticleSchema>, 'sections'>;
}
export class Composer {
  constructor(private book: z.infer<typeof BookSchema>) {
    this.book = book;
  }
  getWorkInProgressTask() {
      for (const chapter of this.book.chapters) {
      for (const article of chapter.articles) {
        for (const section of article.sections) {
            if ((section.content?.trim() ?? '') === '') {
              
          }
        }
      }
    }
  }
  composeWriteTasks = () => {};
}
