import { Where } from './'

export interface AliasModelType<T> {
  keys: ModelKeys<T>
  name: string
  count(options?: any): Promise<number>
  create(data: T): Promise<T>
  createMany(data: T[]): Promise<T[]>
  deleteMany(options?: Where<T>): Promise<boolean>
  deleteOne(options: Where<T>): Promise<boolean>
  distinct(options: any): Promise<T[]>
  exists(options: Where<T>): Promise<boolean>
  find(options?: any): Promise<T[]>
  findById(id: number): Promise<T>
  findByIdAndDelete(id: number): Promise<boolean>
  findByIdAndRemove(id: number): Promise<boolean>
  findByIdAndUpdate(id: number, data: T): Promise<T>
  findOne(options: any): Promise<T>
  findOneAndDelete(options: Where<T>): Promise<boolean>
  findOneAndRemove(options: Where<T>): Promise<boolean>
  findOneAndUpdate(options: Where<T>, data: T): Promise<T>
}

export interface ModelType<T> extends AliasModelType<T> {
  as(alias: string): AliasModelType<T>
}

export type ModelKeys<T> = {
  [key in keyof T]: ColumnOptions
}

export interface ColumnOptions {
  autoIncrement?: boolean
  default?: any
  length?: number
  primaryKey?: boolean
  required?: boolean
  type:
    | 'CHAR'
    | 'VARCHAR'
    | 'BINARY'
    | 'VARBINARY'
    | 'TINYBLOB'
    | 'TINYTEXT'
    | 'TEXT'
    | 'BLOB'
    | 'MEDIUMTEXT'
    | 'MEDIUMBLOB'
    | 'LONGTEXT'
    | 'LONGBLOB'
    | 'ENUM'
    | 'SET'
    | 'BIT'
    | 'TINYINT'
    | 'BOOL'
    | 'BOOLEAN'
    | 'SMALLINT'
    | 'MEDIUMINT'
    | 'INT'
    | 'INTEGER'
    | 'BIGINT'
    | 'FLOAT'
    | 'FLOAT'
    | 'DOUBLE'
    | 'DOUBLE PRECISION'
    | 'DECIMAL'
    | 'DEC'
    | 'DATE'
    | 'DATETIME'
    | 'TIMESTAMP'
    | 'TIME'
    | 'YEAR'
}
