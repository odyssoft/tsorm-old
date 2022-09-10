import { ColumnOptions, Indexable, KeyOf } from './'

export declare class ModelClass<T> {
  constructor(data: T)
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: ColumnOptions
} & Indexable
