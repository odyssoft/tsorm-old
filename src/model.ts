import { IUser, UserKeys } from './example/models'
import { Pool } from 'mysql2/promise'
import { KeyOf, ModelKeys } from './'

export function createModel<T>(name: string, keys: ModelKeys<T>, connection: Pool) {
  return class Model {
    data: T
    constructor(data: T) {
      this.data = data
    }

    public save(): T {
      return {} as T
    }

    public static create(data: T): T {
      return data
    }
    public static createMany(): T[] {
      return [{}] as T[]
    }

    public static deleteMany(): number {
      return 0
    }
    public static deleteOne(): boolean {
      return false
    }
    public static deleteBy(): boolean {
      return false
    }
    public static deleteById(): boolean {
      return false
    }

    public static find(): T | T[] {
      return {} as T
    }
    public static findBy(key: KeyOf<T>, value: any): T | T[] {
      return {} as T
    }
    public static findById(): T {
      return {} as T
    }
    public static findOne(): T {
      return {} as T
    }
    public static findOneBy(): T {
      return {} as T
    }

    public static updateMany(): T[] {
      return [{}] as T[]
    }
    public static updateOne(): T {
      return {} as T
    }
    public static updateOneBy(): T {
      return {} as T
    }
  }
}

const test = createModel<IUser>('user', UserKeys, {} as Pool)
