import { FieldPacket, OkPacket, RowDataPacket } from 'mysql2'
import { ColumnOptions, Indexable, KeyOf, Or, OperatorType } from './'

export type AliasModelKeys<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends JoinModelType<AliasModelKeys<T, A>> {
  keys: ModelKeys<AliasModelKeys<T, A>>
}

export interface BaseModelType<T> {
  [key: string]: any
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

export type ModelKeys<T> = {
  [key in KeyOf<T>]: ColumnOptions
} & Indexable

export interface ModelType<T> extends BaseModelType<T> {
  keys: ModelKeys<T>
  as<A extends string>(alias: A): AliasModelType<T, A>
}

export type Select<T> = (options?: SelectOptions<T>) => void
export interface SelectOptions<T> {
  $columns?: KeyOf<T>[]
  $where?: Where<T>
}

interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
type WhereOptions<T> = {
  [Key in KeyOf<T>]?: boolean | number | null | OperatorType<T> | OperatorType<T>[] | StringOverride
}
