import { DataType } from './'

export interface ColumnOptions {
  autoIncrement?: boolean
  default?: any
  primaryKey?: boolean
  required?: boolean
  unique?: boolean
  type: DataType
}
