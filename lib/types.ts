export class Myblob {
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
