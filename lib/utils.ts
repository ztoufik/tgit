import {Commit,Ref} from './types.ts';
import { Entity,PrimaryColumn,Column,Repository} from "@typeorm"
import * as fs from 'fs';


async function hashStringSync(input: string): Promise<string> {

    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const hashhex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashhex;
}

async function _hash_file(file_path:string):Promise<Myblob>{
    const content=fs.readFileSync(file_path,'utf8');
    const hash_id=await hashStringSync(content);
    const blob:Myblob={
        content,
        path:file_path,
        hash_id,
        blob_type:'file',
        date:new Date(),
    };
    return blob;
}

function dir_walk(dir_path:string,dir:any={}):any{
    let hashs_ids:any={};
    const entries = fs.readdirSync(dir_path, { withFileTypes: true });
    for(const entrie of entries){
        if (entrie.isDirectory()){
            hashs_ids[entrie.name]=dir_walk(entrie.name,dir)
        }
        else{
            hashs_ids[entrie.name]=dir_walk(entrie.name,hash_file(entrie.name))
        }
    }
    dir[dir_path]=hashs_ids;
    return dir;
}

function hash_dir(dir_path:string):Myblob{
    const dir_content=dir_walk(dir_path,{});
    const content=JSON.stringify(dir_content);
    const hash_id=hashStringSync(content);
    const blob:Myblob={
        content,
        hash_id,
        blob_type:'tree',
        date:Date.now(),
    };
    return blob;
}

export async function hash_file(file_path:string,repo:Repository<Myblob>):Promise<Boolean>{
    if (!await Bun.file(file_path).exists()){
        return false;
    }
    let _blob=await _hash_file(file_path);
    console.log(_blob)
    if(repo){
        await repo.save(_blob)
        return true;
    }
    return false;
}
