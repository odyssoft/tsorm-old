import { AliasModelType, ModelKeys, ModelType } from './types'

function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    name,
    keys,
    as(alias: string): AliasModelType<T> {
      return <AliasModelType<T>>(<any>this)
    },
    count(options?: any): Promise<number> {
      return Promise.resolve(0)
    },
    create(data: T): Promise<T> {
      return Promise.resolve({} as T)
    },
    createMany(data: T[]): Promise<T[]> {
      return Promise.resolve([] as T[])
    },
    deleteMany(options?: any): Promise<boolean> {
      return Promise.resolve(true)
    },
    deleteOne(options: any): Promise<boolean> {
      return Promise.resolve(true)
    },
    distinct(options: any): Promise<T[]> {
      return Promise.resolve([] as T[])
    },
    exists(options: any): Promise<boolean> {
      return Promise.resolve(true)
    },
    find(options?: any): Promise<T[]> {
      return Promise.resolve([] as T[])
    },
    findById(id: number): Promise<T> {
      return Promise.resolve({} as T)
    },
    findByIdAndDelete(id: number): Promise<boolean> {
      return Promise.resolve(true)
    },
    findByIdAndRemove(id: number): Promise<boolean> {
      return Promise.resolve(true)
    },
    findByIdAndUpdate(id: number, data: T): Promise<T> {
      return Promise.resolve({} as T)
    },
    findOne(options: any): Promise<T> {
      return Promise.resolve({} as T)
    },
    findOneAndDelete(options: any): Promise<boolean> {
      return Promise.resolve(true)
    },
    findOneAndRemove(options: any): Promise<boolean> {
      return Promise.resolve(true)
    },
    findOneAndUpdate(options: any): Promise<T> {
      return Promise.resolve({} as T)
    },
  }
}

export default model
