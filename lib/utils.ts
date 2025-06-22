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

export async function store_file(file_path:string,repo:Repository<Myblob>):Promise<Boolean|Myblob>{
    if (!await Bun.file(file_path).exists()){
        return false;
    }
    let _blob=await _hash_file(file_path);
    if(repo){
        return await repo.save(_blob)
    }
    return false;
}

export async function deserialize_dir(dir_path:string):Promise<Tree>{
    let trees:Tree={}
    const entries = fs.readdirSync(dir_path, { withFileTypes: true });
    for(const entrie of entries){
        const fullpath=path.join(entrie.path,entrie.name)
        if (entrie.isDirectory()){
            trees[entrie.name]=await deserialize_dir(fullpath)
        }
        else{
            trees[entrie.name]=await _hash_file(fullpath)
        }
    }
    return trees;
}

export function hash_dir(tree:Tree):[any,any]{
    let hashs_tree={};
    let files_blob=[];
    for(const entrie in tree){
        if(tree[entrie].hash){
            hashs_tree[entrie]=tree[entrie].hash
            files_blob.push(tree[entrie])
        }
        else {
            let output=hash_dir(tree[entrie])
            hashs_tree[entrie]=output[0]
            files_blob=files_blob.concat(output[1])
        }
    }
    return [hashs_tree,files_blob];
}

export async function store_dir(dir_path:string,repo:Repository<Myblob>):Promise<Myblob>{
    const tree=await deserialize_dir(dir_path)
    const [hashs_tree,files_blobs]=hash_dir(tree)
    let dir_tree={};
    dir_tree[dir_path]=hashs_tree;
    const dir_content=JSON.stringify(dir_tree)
    const dir_hash=await hashString(dir_content)
    const dir_blob:Myblob={
        hash:dir_hash,
        content:dir_content,
        blob_type:'tree',
        path:dir_path,
        date:new Date(),
    }
    await repo.save(files_blobs)
    return await repo.save(dir_blob)
}

export async function retrieve_obj(object_id:string,repo:Repository<Myblob>):Promise<Myblob>{
    const obj:any={hash:object_id}
    return await repo.find(Myblob,obj);
}
