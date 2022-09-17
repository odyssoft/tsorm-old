export interface ColumnOptions {
  autoIncrement?: boolean
  default?: any
  length?: number
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
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
