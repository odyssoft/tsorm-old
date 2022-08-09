import { ColumnOptions, Delete, Indexable, Insert, JoinOptions, KeyOf, Select, Update } from './'

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
  as<A extends string>(alias: string): AliasModelType<T, A>
}
