import {Myblob,Commit,Ref} from './types';
import type { IDataLayer } from './data';
import { EntitySchema,DataSource} from "typeorm"


/*class SqliteHasher implements IDataLayer{
  orm:MikroORM;
  constructor(name:string){
  this.orm = MikroORM.initSync<SqliteDriver>({
  entities: [Myblob,Commit,Ref],
  dbName: name,
  type:'sqlite',
  });

  }

  create_blob(blob:Myblob):void{
  this.orm.em.persistAndFlush(blob)
  }

  async retrieve_blob(hash_id:string):Promise<Myblob>{
  return this.orm.em.findOne(Myblob, {hash_id}).then(_blob=> _blob);
  }

  create_commit(commit:Commit):void{
  this.orm.em.persistAndFlush(commit);
  }
  async retrieve_commit(hash_id:string):Promise<Commit>|null{
  return this.orm.em.findOne(Commit, {hash_id}).then(commit=> commit);
  }

  create_ref(ref:Ref):void{
  this.orm.em.persistAndFlush(ref);
  }

  update_ref(old_ref:Ref,new_ref:Ref):void{
  const old_obj=this.orm.em.findOne(Ref, {name:old_ref.name}).then(commit=> commit);
  }

  retrieve_ref(name:string):Ref{
  return this.orm.em.findOne(Ref, {name}).then(ref=> ref);
  }
  }*/

export const BlobSchema = new EntitySchema<Myblob>({
    name: 'Blob',
    tableName: 'blobs', // Optional: specify table name if different from entity name
    columns: {
        id:{
            type:Number,
            generated:true,
            primary: true,
        },
        hash: {
            type: String,
            nullable:false,
        },
        path:{
            type: String,
            nullable:false,
        },
        content:{
            type: String,
            nullable:false,
        },
        blob_type:{
            type: String,
            nullable:false,
        },
        date:{
            type: String,
            nullable:false,
        },
    },
})

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "tgit.sql",
    entities: [BlobSchema],
    synchronize: true,
})

await AppDataSource.initialize()

export const repo =AppDataSource.getRepository(BlobSchema);

