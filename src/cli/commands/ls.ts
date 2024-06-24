import {Command} from 'commander';
import {Table} from 'console-table-printer';
import {IDEA_OUTPUT_DIR} from '../../constants';
import {ensureDirCreated, getIdeaList} from '../utils';

const command = new Command('ls')
  .description('list all the ideas')
  .action(async () => {
    await ensureDirCreated();
    const ideas = await getIdeaList();
    const table = new Table({
      title: '\nData Stored in:\n' + IDEA_OUTPUT_DIR,
      columns: [
        {
          name: 'name',
          alignment: 'left',
        },
        {
          name: 'created',
          alignment: 'left',
        },
      ],
      rows: ideas,
    });
    table.printTable();
  });

export {command};
