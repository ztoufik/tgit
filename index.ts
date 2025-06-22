import { subcommands,command, run, string, positional } from 'cmd-ts';
import { store_file,  store_dir} from "./lib/utils"
import {repo} from './lib/sqlite'
import { statSync } from "node:fs";


const hash_object = command({
  name: 'hash-object',
  args: {
    object_path: positional({ type: string, displayName: 'object_path' }),
  },
  handler: (args) => {
      const stats = statSync(args.object_path)
      if(stats.isFile()){
          store_file(args.object_path,repo)
      }
      if(stats.isDirectory()){
          store_dir(args.object_path,repo)
      }
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
