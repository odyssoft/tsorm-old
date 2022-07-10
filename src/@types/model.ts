export type IModel<T> = (data: T) => ModelType<T> | ModelType<T>[]
// export interface
export interface AliasModelType<T> {
  [key: string]: any
  count: () => Promise<number>
  create: () => Promise<any>
  deleteMany: () => Promise<any>
  deleteOne: () => Promise<any>
  distinct: () => Promise<T[]>
  exists: () => Promise<boolean>
  find: () => Promise<T[]>
  findById: () => Promise<T>
  findByIdAndDelete: () => Promise<any>
  findByIdAndRemove: () => Promise<any>
  findByIdAndUpdate: () => Promise<T>
  findOne: () => Promise<T>
  findOneAndDelete: () => Promise<any>
  findOneAndRemove: () => Promise<any>
  findOneAndReplace: () => Promise<T>
  findOneAndUpdate: () => Promise<T>
  insertMany: () => Promise<any>
  name: string
  update: () => Promise<T>
  updateMany: () => Promise<T[]>
  updateOne: () => Promise<T>
}

export interface ModelType<T> extends AliasModelType<T> {
  as: (alias: string) => AliasModelType<T>
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
