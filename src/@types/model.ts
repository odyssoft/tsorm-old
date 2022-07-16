export type IModel<T> = (data: T) => ModelType<T> | ModelType<T>[]
// export interface
export interface AliasModelType<T> {
  [key: string]: any
  count?: (options?: any) => Promise<number>
  create?: (data: T) => Promise<any>
  deleteMany?: (options?: any) => Promise<any>
  deleteOne?: (options: any) => Promise<any>
  distinct?: (options: any) => Promise<T[]>
  exists?: (options: any) => Promise<boolean>
  find?: (options?: any) => Promise<T[]>
  findById?: (id: number) => Promise<T>
  findByIdAndDelete?: (id: number) => Promise<any>
  findByIdAndRemove?: (id: number) => Promise<any>
  findByIdAndUpdate?: (id: number, data: T) => Promise<T>
  findOne?: (options?: any) => Promise<T>
  findOneAndDelete?: (options: any) => Promise<any>
  findOneAndRemove?: (options: any) => Promise<any>
  findOneAndReplace?: (options: any, data: T) => Promise<T>
  findOneAndUpdate?: (options: any, data: T) => Promise<T>
  insertMany?: (data: T[]) => Promise<any>
  keys: ModelKeys<T>
  name: string
  update?: (data: T | T[]) => Promise<T>
  updateMany?: (data: T[]) => Promise<T[]>
  updateOne?: (data: T) => Promise<T>
}

export interface ModelType<T> extends AliasModelType<T> {
  as?: (alias: string) => AliasModelType<T>
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
