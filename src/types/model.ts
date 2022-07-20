import { ColumnOptions, Where } from './'

export type AliasModelKeys<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends BaseModelType<T> {
  keys: AliasModelKeys<T, A>
}

export interface BaseModelType<T> {
  name: string
  count(options?: any): Promise<number>
  create(data: T): Promise<T>
  createMany(data: T[]): Promise<T[]>
  deleteMany(options?: Where<T>): Promise<boolean>
  deleteOne(options: Where<T>): Promise<boolean>
  distinct(options: any): Promise<T[]>
  exists(options: Where<T>): Promise<boolean>
  find(options?: any): Promise<T[]>
  findById(id: number): Promise<T>
  findByIdAndDelete(id: number): Promise<boolean>
  findByIdAndRemove(id: number): Promise<boolean>
  findByIdAndUpdate(id: number, data: T): Promise<T>
  findOne(options: any): Promise<T>
  findOneAndDelete(options: Where<T>): Promise<boolean>
  findOneAndRemove(options: Where<T>): Promise<boolean>
  findOneAndUpdate(options: Where<T>, data: T): Promise<T>
}

export type ModelKeys<T> = {
  [key in keyof T]: ColumnOptions
}

export interface ModelType<T> extends BaseModelType<T> {
  keys: ModelKeys<T>
  as<A extends string>(alias: string): AliasModelType<T, A>
}
