import {Tree,Myblob,Commit,Ref} from './types.ts';
import { Repository} from "@typeorm"
import * as fs from 'fs';
import * as path from "path"



async function hashString(input: string): Promise<string> {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const hashhex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashhex;
}

export async function _hash_file(file_path:string):Promise<Myblob>{
    const content=fs.readFileSync(file_path,'utf8');
    const hash_id=await hashString(content);
    const blob:Myblob={
        content,
        path:file_path,
        hash: hash_id,
        blob_type:"file",
        date:new Date(),
    };
    return blob;
}

export async function store_file(file_path:string,repo:Repository<Myblob>):Promise<Boolean>{
    if (!await Bun.file(file_path).exists()){
        return false;
    }
    let _blob=await _hash_file(file_path);
    if(repo){
        await repo.save(_blob)
        return true;
    }
    return false;
}

export async function dir_walk(dir_path:string):Promise<Tree>{
    let trees:Tree={}
    const entries = fs.readdirSync(dir_path, { withFileTypes: true });
    for(const entrie of entries){
        const fullpath=path.join(entrie.path,entrie.name)
        if (entrie.isDirectory()){
            trees[entrie.name]=await dir_walk(fullpath)
        }
        else{
            trees[entrie.name]=await _hash_file(fullpath)
        }
    }
    return trees;
}

export function _blobize_dir(tree:Tree):any{
    let hashs_tree={};
    for(const entrie in tree){
        if(tree[entrie].hash_id){
            hashs_tree[entrie]=tree[entrie].hash_id
        }
        else {
            hashs_tree[entrie]=_blobize_dir(tree[entrie])
        }
    }
    return hashs_tree;
}

export async function hash_dir(dir_tree:Tree,repo:Repository<Myblob>){
    for(const entrie in dir_tree){
        if (dir_tree[entrie].hash_id){
            await repo.save(dir_tree[entrie] as Myblob)
        }
        else{
            await hash_dir(dir_tree[entrie],repo);
        }
    }
}
