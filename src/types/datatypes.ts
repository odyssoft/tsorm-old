export type DataType =
  | 'BIGINT'
  | 'BOOL'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'INT'
  | 'INTEGER'
  | 'LONGBLOB'
  | 'LONGTEXT'
  | 'MEDIUMBLOB'
  | 'MEDIUMINT'
  | 'MEDIUMTEXT'
  | 'SMALLINT'
  | 'TIME'
  | 'TIMESTAMP'
  | 'TINYBLOB'
  | 'TINYINT'
  | 'TINYTEXT'
  | 'YEAR'
  | `BINARY(${string})`
  | `BIT(${string})`
  | `BLOB(${string})`
  | `CHAR(${string})`
  | `DEC(${string}, ${string})`
  | `DECIMAL(${string}, ${string})`
  | `DOUBLE PRECISION(${string}, ${string})`
  | `DOUBLE(${string}, ${string})`
  | `ENUM(${string})`
  | `FLOAT(${string}, ${string})`
  | `SET(${string})`
  | `TEXT(${string})`
  | `VARBINARY(${string})`
  | `VARCHAR(${string})`

export interface DataTypesType {
  bigInt: DataType
  binary: (size: number) => DataType
  bit: (size: number) => DataType
  blob: (size: number) => DataType
  bool: DataType
  boolean: DataType
  char: (size: number) => DataType
  date: DataType
  datetime: DataType
  dec: (size: number, digits: number) => DataType
  decimal: (size: number, digits: number) => DataType
  double: (size: number, digits: number) => DataType
  doublePrecision: (size: number, digits: number) => DataType
  enum: (options: string[]) => DataType
  float: (size: number, digits: number) => DataType
  int: DataType
  integer: DataType
  longBlob: DataType
  longText: DataType
  mediumBlob: DataType
  mediumInt: DataType
  mediumText: DataType
  set: (options: string[]) => DataType
  smallInt: DataType
  text: (size: number) => DataType
  time: DataType
  timestamp: DataType
  tinyBlob: DataType
  tinyInt: DataType
  tinyText: DataType
  varBinary: (size: number) => DataType
  varchar: (size: number) => DataType
  year: DataType
}
