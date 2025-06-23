import * as path from 'path'
export const db_path='.tgit/tgit.sql';
export const tgit_dir='.tgit';
const _tgitignore_path=path.join(tgit_dir,'.tgitignore')
async function read_tgitignore_file():Promise<string[]>{
    try {
        const file = Bun.file(_tgitignore_path);
        const content = await file.text();
        const lines = content.split(/\r?\n/); // Handles both CRLF and LF newlines

        // Filter out empty lines that might result from trailing newlines
        return lines.filter(line => line.length > 0); 
    } catch (error) {
        console.error(`Error reading file ${_tgitignore_path}:`, error);
        return [];
    }
}
export const tgit_ignore_file=await read_tgitignore_file()
