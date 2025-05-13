import type {Ref,Commit,Blob} from './types';
export interface ISerialzer{
    create_blob(blob:Blob):boolean;
    retrieve_blob(hash_id:string):Blob|null;

    create_commit(commit:Commit):boolean;
    retrieve_commit(hash_id:string):Commit|null;

    create_ref(ref:Ref):boolean;
    update_ref(old_ref:Ref,new_ref:Ref):boolean;
    retrieve_ref(name:string):Ref|null;
};
