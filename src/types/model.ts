import { ColumnOptions, Indexable, KeyOf, OperatorType, Or } from './'

export type Alias<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export type AliasModel<T> = {
  [key: string]: any
  keys: ModelKeys<T>
  join: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    join: Join,
    on: JoinOptions<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>
}
/*

export type AliasModelKeys<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends JoinModelType<AliasModelKeys<T, A>> {
  keys: ModelKeys<AliasModelKeys<T, A>>
}

export interface BaseModelType<T> {
  [key: string]: any
  connection?: Pool
  keys: ModelKeys<T>
  name: string
  delete: (options: Where<T>) => Promise<[OkPacket, FieldPacket[]]>
  insert: (data: T | T[]) => Promise<[OkPacket, FieldPacket[]]>
  select: (options?: SelectOptions<T>) => Promise<[RowDataPacket[], FieldPacket[]]>
  truncate: () => Promise<[OkPacket, FieldPacket[]]>
  update: (data: Partial<T>, options: Where<T>) => Promise<[OkPacket, FieldPacket[]]>
  upsert: (data: Partial<T> | Partial<T>[]) => Promise<[OkPacket, FieldPacket[]]>
}

export type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}
export interface JoinModelType<T> extends BaseModelType<T> {
  join: <S, A extends string>(
    model: AliasModelType<S, A>,
    options: JoinOptions<T & AliasModelKeys<S, A>>
  ) => JoinModelType<T & AliasModelKeys<S, A>>
}

*/

export type Join = 'CROSS' | 'INNER' | 'LEFT' | 'RIGHT' | 'LEFT OUTER' | 'RIGHT OUTER'

export type JoinObject = {
  alias: string
  join: Join
  on: any
}

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

export interface SelectOptions<T> {
  $columns?: KeyOf<T>[]
  $where?: Where<T>
}

export interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
export type WhereOptions<T> = {
  [Key in KeyOf<T>]?: QueryType<T>
}
