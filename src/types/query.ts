import { Operator, Or } from './operator'
import { KeyOf, StringOverride } from './utils'

export type ColumnType<T> = KeyOf<T> | StringOverride

export type DeleteOptions = {
  limit?: number
}

export type GroupBy<T> = KeyOf<T> | StringOverride

export type InsertOptions = {
  ignore?: boolean
}

export type Limit = [number, number?]

export type OrderBy<T> = KeyOf<T> | `${KeyOf<T>} ASC` | `${KeyOf<T>} DESC` | StringOverride

export type QueryType<T> = boolean | number | null | Operator<T> | Operator<T>[] | StringOverride

export type SelectOptions<T> = {
  $columns?: ColumnType<T>[]
  $where?: Where<T>
  $limit?: Limit
  $groupBy?: GroupBy<T> | GroupBy<T>[]
  $orderBy?: OrderBy<T> | OrderBy<T>[]
}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
export type WhereOptions<T> = {
  [Key in KeyOf<T>]?: QueryType<T>
}
