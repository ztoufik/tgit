export class Myblob {
    id?:number;

    hash!:string;

    path!:string;

    blob_type!:string

    date!:Date;

    content!:string;
};

export class Commit {
};

export class Ref {
}

export class File_Error{
    msg:string;
    constructor(msg:string){
        this.msg=msg;
    }
}

export type Tree={
    string?:Myblob|Tree,
}
