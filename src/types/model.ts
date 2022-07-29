import { ColumnOptions, Indexable, KeyOf, Where } from './'

export type AliasModelKeys<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends BaseModelType<T> {
  keys: AliasModelKeys<T, A>
}

export interface BaseModelType<T> {
  [key: string]: any
  name: string
  delete: (options: Where<T>) => void
  insert: (data: T | T[]) => void
  update: (data: T | T[]) => void
  select: <S = any>(options: Where<T, S>) => void
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]: ColumnOptions
} & Indexable

export interface ModelType<T> extends BaseModelType<T> {
  keys: ModelKeys<T>
  as<A extends string>(alias: string): AliasModelType<T, A>
}
