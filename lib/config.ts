import * as path from 'path'
import { Glob} from 'bun'
export const db_path='.tgit/tgit.sql';
export const tgit_dir='.tgit';
const _tgitignore_path=path.join(tgit_dir,'.tgitignore')
async function read_tgitignore_file():Promise<Glob[]>{
    try {
        const file = Bun.file(_tgitignore_path);
        const content = await file.text();
        const lines = content.split(/\r?\n/); // Handles both CRLF and LF newlines

        // Filter out empty lines that might result from trailing newlines
        return lines.filter(line => line.length > 0).map(str => new Glob(str)); 
    } catch (error) {
        console.error(`Error reading file ${_tgitignore_path}:`, error);
        return [];
    }
}
export async function  ignore_dir_file(file_path:string):Promise<Boolean>{
    const globs=await read_tgitignore_file();
    for (const glob of globs){
        if (glob.match(file_path))
            return true;
    }
    return false;
}
