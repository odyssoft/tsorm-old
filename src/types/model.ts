import { ColumnOptions, Indexable, KeyOf, OperatorType, Or } from './'

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: ColumnOptions
} & Indexable

export type QueryType<T> =
  | boolean
  | number
  | null
  | OperatorType<T>
  | OperatorType<T>[]
  | StringOverride

export interface SelectOptions<T> {
  $columns?: KeyOf<T>[]
  $where?: Where<T>
}

export interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
export type WhereOptions<T> = {
  [Key in KeyOf<T>]?: QueryType<T>
}
