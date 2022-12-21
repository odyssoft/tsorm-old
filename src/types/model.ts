import { FieldPacket, OkPacket, RowDataPacket } from 'mysql2'

import { DeleteOptions, InsertOptions, SelectOptions, Where } from './query'
import { Indexable, KeyOf, Unpacked } from './utils'

interface IColumn {}

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: IColumn | ModelType<Unpacked<T[key]>>
} & Indexable

export type ModelType<T> = {}

export type SQLModel<T> = {
  delete: (query: Where<T>, options?: DeleteOptions) => string
  insert: (data: Partial<T> | Partial<T>[], options?: InsertOptions) => string
  select: (query?: SelectOptions<T>) => string
  truncate: () => string
  update: (data: Partial<T>, query: Where<T>) => string
  upsert: (data: T | T[]) => string
}
