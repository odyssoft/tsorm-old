import { ColumnOptions, Indexable, KeyOf, OperatorType, Or } from './'

export type Alias<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export type AliasModel<T> = {
  [key: string]: any
  join: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    join: Join,
    on: JoinOptions<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>
  select: (query?: SelectOptions<T>) => Promise<T[]>
}

export type Join = 'CROSS' | 'INNER' | 'LEFT' | 'RIGHT' | 'LEFT OUTER' | 'RIGHT OUTER'

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: ColumnOptions
} & Indexable

export type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type QueryType<T> =
  | boolean
  | number
  | null
  | OperatorType<T>
  | OperatorType<T>[]
  | StringOverride

export type Limit = number | [LimitStart, LimitEnd]
export type LimitStart = number
export type LimitEnd = number

export type GroupBy<T> = KeyOf<T>
export type OrderBy<T> = KeyOf<T> | `${KeyOf<T>} ASC` | `${KeyOf<T>} DESC`

export interface SelectOptions<T> {
  $columns?: KeyOf<T>[]
  $where?: Where<T>
  $limit?: Limit
  $groupBy?: GroupBy<T> | GroupBy<T>[]
  $orderBy?: OrderBy<T> | OrderBy<T>[]
}

export interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
export type WhereOptions<T> = {
  [Key in KeyOf<T>]?: QueryType<T>
}
