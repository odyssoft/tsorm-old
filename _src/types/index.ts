export * from './delete'
export * from './insert'
export * from './join'
export * from './model'
export * from './operator'
export * from './schema'
export * from './select'
export * from './update'
export * from './where'

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

export type Indexable = {
  [key: string]: any
}

export type KeyOf<T extends any> = Extract<keyof T, string>