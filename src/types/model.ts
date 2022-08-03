import Post, { IPost } from 'example/models/post'
import User from 'example/models/user'
import { ColumnOptions, Delete, Indexable, Insert, Join, KeyOf, Select, Update } from './'

export type AliasModelKeys<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends BaseModelType<AliasModelKeys<T, A>> {
  keys: AliasModelKeys<T, A>
  join: Join<T>
}

export interface BaseModelType<T> {
  [key: string]: any
  name: string
  delete: Delete<T>
  insert: Insert<T>
  select: Select<T>
  update: Update<T>
}

export interface JoinModelType<T, A extends string> extends BaseModelType<AliasModelKeys<T, A>> {
  keys: ModelKeys<AliasModelKeys<T, A>>
  join: Join<AliasModelKeys<T, A>>
  toModel: () => ModelType<T>
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]: ColumnOptions
} & Indexable

export interface ModelType<T> extends BaseModelType<T> {
  keys: ModelKeys<T>
  as<A extends string>(alias: string): AliasModelType<T, A>
}

User.as<'u'>('u').to
