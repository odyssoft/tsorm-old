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
  delete: Delete<T>
  insert: Insert<T>
  select: Select<T>
  update: Update<T>
}

export type Delete<T> = (options: Where<T>) => void
export type DeleteOptions<T, A = any> = Where<A extends string ? AliasModelKeys<T, A> : T>

export type Insert<T> = (data: T | T[]) => void
export type InsertOptions<T> = Where<T>

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

export type Update<T> = (data: Partial<T>, options: UpdateOptions<T>) => void
export type UpdateOptions<T> = Where<T>

interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
type WhereOptions<T> = {
  [Key in KeyOf<T>]?: boolean | number | null | OperatorType<T> | OperatorType<T>[] | StringOverride
}
