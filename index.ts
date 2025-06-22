import { subcommands,command, run, string, positional } from 'cmd-ts';
import { store_file,  store_dir,retrieve_obj} from "./lib/utils"
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
          store_file(args.object_path,repo).then((result)=>{console.log(result.hash)})
      }
      if(stats.isDirectory()){
          store_dir(args.object_path,repo).then((blob)=>{console.log(blob.hash)})
      }
  },
});

const cat_object = command({
  name: 'cat_file',
  args: {
    object_id: positional({ type: string, displayName: 'object_id' }),
  },
  handler: (args) => {

      retrieve_obj(args.object_id,repo).then((result) => {console.log(result[0].content)})
  },
});

const app = subcommands({
  name: 'tgit', // The main command name
  description: 'git clone in TS',
  cmds: {
    "hash-object": hash_object,    // Register the subcommand
    "cat-object": cat_object,    // Register the subcommand
  },
});

run(app, process.argv.slice(2));
