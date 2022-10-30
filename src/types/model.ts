import { FieldPacket, OkPacket, RowDataPacket } from 'mysql2'

import { Alias, AliasModel, ColumnOptions, Indexable, KeyOf, OperatorType, Or } from './'

export type DeleteOptions = {
  limit?: number
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: ColumnOptions
} & Indexable

export type ModelType<T> = {
  new (data: T): {
    data: T
    save: (options?: InsertOptions) => Promise<T>
  }

  delete: (query: Where<T>, limit?: number) => Promise<[OkPacket, FieldPacket[]]>
  insert: (data: T | T[], options?: InsertOptions) => Promise<[OkPacket, FieldPacket[]]>
  select: (query?: SelectOptions<T>) => Promise<[RowDataPacket[], FieldPacket[]]>
  truncate: () => Promise<[OkPacket, FieldPacket[]]>
  update: (data: Partial<T>, query: WhereOptions<T>) => Promise<[OkPacket, FieldPacket[]]>
  upsert: (data: T | T[]) => Promise<[OkPacket, FieldPacket[]]>

  SQL: () => SQLModelType<T>

  as: <A extends string>(alias: A) => AliasModel<Alias<T, A>>

  create: (data: T, options?: InsertOptions) => Promise<T>
  createOne: (data: T, options?: InsertOptions) => Promise<T>
  createMany: (data: T[], options?: InsertOptions) => Promise<T[]>

  deleteBy: (key: KeyOf<T>, query: QueryType<T>) => Promise<number>
  deleteById: (id: number) => Promise<boolean>
  deleteOne: (query: Where<T>) => Promise<boolean>
  deleteOneBy: (key: KeyOf<T>, query: QueryType<T>) => Promise<boolean>

  find: (query?: Where<T>) => Promise<T[]>
  findBy: (key: KeyOf<T>, query: QueryType<T>) => Promise<T[]>
  findById: (id: number) => Promise<T | null>
  findOne: (query?: Where<T>) => Promise<T | null>
  findOneBy: (key: KeyOf<T>, query: QueryType<T>) => Promise<T | null>

  upsertOne: (data: T) => Promise<boolean>
  upsertMany: (data: T[]) => Promise<boolean>
}

export type InsertOptions = {
  ignore?: boolean
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

export type GroupBy<T> = KeyOf<T> | StringOverride
export type OrderBy<T> = KeyOf<T> | `${KeyOf<T>} ASC` | `${KeyOf<T>} DESC` | StringOverride

export type ColumnType<T> = KeyOf<T> | StringOverride

export interface SelectOptions<T> {
  $columns?: ColumnType<T>[]
  $where?: Where<T>
  $limit?: Limit
  $groupBy?: GroupBy<T> | GroupBy<T>[]
  $orderBy?: OrderBy<T> | OrderBy<T>[]
}

export type SQLModelType<T> = {
  delete: (query: Where<T>, limit?: number) => string
  insert: (data: T | T[], options?: InsertOptions) => string
  select: (query?: SelectOptions<T>) => string
  truncate: () => string
  update: (data: Partial<T>, query: WhereOptions<T>) => string
  upsert: (data: T | T[]) => string
}

export interface StringOverride extends String {}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
export type WhereOptions<T> = {
  [Key in KeyOf<T>]?: QueryType<T>
}
