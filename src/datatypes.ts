import { DataType, DataTypesType } from './types'

export const DataTypes: DataTypesType = {
  bigInt: 'BIGINT',
  /**
   * Equal to CHAR(), but stores binary byte strings. The size parameter specifies the column length in bytes. Default is 1
   * @param {number} size
   * @returns String
   */
  binary: (size: number): DataType => `BINARY(${size})`,
  /**
   * A bit-value type. The number of bits per value is specified in size. The size parameter can hold a value from 1 to 64. The default value for size is 1.
   * @param {number} size
   * @returns String
   */
  bit: (size: number): DataType => `BIT(${size})`,
  /**
   * For BLOBs (Binary Large OBjects). Holds up to 65,535 bytes of data
   * @param {number} size
   * @returns String
   */
  blob: (size: number): DataType => `BLOB(${size})`,
  bool: 'BOOL',
  boolean: 'BOOLEAN',
  /**
   * A FIXED length string (can contain letters, numbers, and special characters). The size parameter specifies the column length in characters - can be from 0 to 255. Default is 1
   * @param {number} size
   * @returns String
   */
  char: (size: number): DataType => `CHAR(${size})`,
  date: 'DATE',
  datetime: 'DATETIME',
  /**
   * Equal to DECIMAL(size,d)
   * @param {number} size
   * @param {number} digits
   * @returns String
   */
  dec: (size: number, digits: number): DataType => `DEC(${size}, ${digits})`,
  /**
   * An exact fixed-point number. The total number of digits is specified in size. The number of digits after the decimal point is specified in the d parameter. The maximum number for size is 65. The maximum number for d is 30. The default value for size is 10. The default value for d is 0.
   * @param {number} size
   * @param {number} digits
   * @returns String
   */
  decimal: (size: number, digits: number): DataType => `DECIMAL(${size}, ${digits})`,
  /**
   * A normal-size floating point number. The total number of digits is specified in size. The number of digits after the decimal point is specified in the d parameter
   * @param {number} size
   * @param {number} digits
   * @returns String
   */
  double: (size: number, digits: number): DataType => `DOUBLE(${size}, ${digits})`,
  doublePrecision: (size: number, digits: number): DataType =>
    `DOUBLE PRECISION(${size}, ${digits})`,
  /**
   * A string object that can have only one value, chosen from a list of possible values. You can list up to 65535 values in an ENUM list. If a value is inserted that is not in the list, a blank value will be inserted. The values are sorted in the order you enter them
   * @param {array} options
   * @returns String
   */
  enum: (options: string[]): DataType => `ENUM(${options.map((o) => `'${o}'`).join(', ')})`,
  /**
   * A floating point number. The total number of digits is specified in size. The number of digits after the decimal point is specified in the d parameter. This syntax is deprecated in MySQL 8.0.17, and it will be removed in future MySQL versions
   * @param {number} size
   * @param {number} digits
   * @returns String
   */
  float: (size: number, digits: number): DataType => `FLOAT(${size}, ${digits})`,
  int: 'INT',
  integer: 'INTEGER',
  longBlob: 'LONGBLOB',
  longText: 'LONGTEXT',
  mediumBlob: 'MEDIUMBLOB',
  mediumInt: 'MEDIUMINT',
  mediumText: 'MEDIUMTEXT',
  /**
   * A string object that can have 0 or more values, chosen from a list of possible values. You can list up to 64 values in a SET list
   * @param {array} options
   * @returns String
   */
  set: (options: string[]): DataType => `SET(${options.map((o) => `'${o}'`).join(', ')})`,
  smallInt: 'SMALLINT',
  /**
   * Holds a string with a maximum length of 65,535 bytes
   * @param {number} size
   * @returns String
   */
  text: (size: number): DataType => `TEXT(${size})`,
  time: 'TIME',
  timestamp: 'TIMESTAMP',
  tinyBlob: 'TINYBLOB',
  tinyInt: 'TINYINT',
  tinyText: 'TINYTEXT',
  /**
   * Equal to VARCHAR(), but stores binary byte strings. The size parameter specifies the maximum column length in bytes.
   * @param {number} size
   * @returns String
   */
  varBinary: (size: number): DataType => `VARBINARY(${size})`,
  /**
   * A VARIABLE length string (can contain letters, numbers, and special characters). The size parameter specifies the maximum column length in characters - can be from 0 to 65535
   * @param {number} size
   * @returns String
   */
  varchar: (size: number): DataType => `VARCHAR(${size})`,
  year: 'YEAR',
}
