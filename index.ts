import { subcommands,command, run, string, positional } from 'cmd-ts';
import type { Tree} from "./lib/types"
import { _hash_file,store_file,hash_dir, dir_walk,_blobize_dir} from "./lib/utils"
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
          //hash_file(args.object_path,repo)
          _hash_file(args.object_path).then(tree => { 
              console.log(tree) 
          })
      }
      if(stats.isDirectory()){
          //hash_dir(args.object_path,repo)
          const tree=dir_walk(args.object_path)
          tree.then(tree => { 
              let up_tree:Tree={}
              up_tree[args.object_path]=tree;
              console.log(_blobize_dir(up_tree)) 
          })
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
