import { ColumnOptions, Indexable, KeyOf } from './'

export declare class ModelClass<T> {
  constructor(data: T)
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]-?: ColumnOptions
} & Indexable

export declare class ModelType<T> {
  constructor(data: T)

  // public save(): T

  // static create<T>(data: T): T
  // static createMany<T>(): T[]
  // static deleteMany(): number
  // static deleteOne(): boolean
  // static deleteBy(): boolean
  // static deleteById(): boolean
  // static find(): T | T[]
  // static findBy(key: KeyOf<T>, value: any): T | T[]
  // static findById(): T
  // static findOne(): T
  // static findOneBy(): T
  // static updateMany(): T[]
  // static updateOne(): T
  // static updateOneBy(): T
}
