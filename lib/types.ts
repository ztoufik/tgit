import { Entity, PrimaryColumn, Column} from "typeorm"


@Entity({name:"myblob"})
export class Myblob {
    @PrimaryColumn("text")
    hash_id!:string;

    @Column()
    path!:string;

    @Column()
    blob_type!:string

    @Column("date")
    date!:Date;

    @Column("text")
    content!:string;
};

@Entity()
export class Commit {
    @PrimaryColumn()
    hash_id!:string;
    @Column("text")
    content!:string;
    @Column()
    parent!:Commit[];
    @Column("date")
    date!:Date;
};

@Entity()
export class Ref {
    @PrimaryColumn()
    name!:string;
    @Column()
    ref_type!:string;
    @Column("text")
    content!:string;
    @Column("date")
    date!:Date;
}

export class File_Error{
    msg:string;
    constructor(msg:string){
        this.msg=msg;
    }
}
