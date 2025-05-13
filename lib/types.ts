export type blob_type='file'|'tree'
export type ref_type='crude_ref' | 'sym_ref';

export type Blob={
    hash_id:string;
    path:string;
    type:blob_type;
    date:Date;
    content:string;
};

export type Commit={
    hash_id:string;
    content:string;
    parent:Commit[];
    date:Date;
};

export type Ref={
    name:string;
    type:ref_type;
    content:string;
    date:Date;
}
