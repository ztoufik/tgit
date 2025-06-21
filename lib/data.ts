import type {Ref,Commit,Myblob} from './types';

export interface IDataLayer{
    create_blob(blob:Myblob):void;
    retrieve_blob(hash_id:string):Promise<Myblob>;

    create_commit(commit:Commit):void;
    retrieve_commit(hash_id:string):Promise<Commit>;

    create_ref(ref:Ref):void;
    update_ref(old_ref:Ref,new_ref:Ref):void;
    retrieve_ref(name:string):Promise<Ref>;
};

