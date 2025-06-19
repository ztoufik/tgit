import { subcommands,command, run, string, positional } from 'cmd-ts';
import { hash_file} from "./lib/utils"
import { DataSource} from "typeorm"
import {Myblob,Commit,Ref} from './lib/types';

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "tgit.sql",
    entities: [Myblob],
    logging: true,
    synchronize: true,
})

await AppDataSource.initialize()

const repos =AppDataSource.getRepository(Myblob);

const hash_object = command({
  name: 'hash-object',
  args: {
    object_path: positional({ type: string, displayName: 'object_path' }),
  },
  handler: (args) => {
      hash_file(args.object_path,repos)
  },
});

const app = subcommands({
  name: 'tgit', // The main command name
  description: 'git clone in TS',
  cmds: {
    "hash-object": hash_object,    // Register the subcommand
  },
});

run(app, process.argv.slice(2));
