import { IUser, UserKeys } from './example/models'
import { OkPacket, Pool } from 'mysql2/promise'
import { getInsertKeys, getInsertValues, ModelKeys } from './'

export function createModel<T>(name: string, keys: ModelKeys<T>, connection: Pool) {
  return class Model {
    data: T
    constructor(data: T) {
      this.data = data
    }

    public save(): T {
      return {} as T
    }

    public static create(data: T): Promise<T> {
      const insertKeys: string[] = getInsertKeys(data)
      const insertValues: string = getInsertValues(data, insertKeys)
      return connection
        .query<OkPacket>(
          `INSERT INTO \`${name}\` (${insertKeys.join(', ')}) VALUES ${insertValues}`
        )
        .then(([{ insertId }]) => ({
          ...data,
          id: insertId,
        }))
    }
    // public static createMany(): T[] {
    //   return [{}] as T[]
    // }

    // public static deleteMany(): number {
    //   return 0
    // }
    // public static deleteOne(): boolean {
    //   return false
    // }
    // public static deleteBy(): boolean {
    //   return false
    // }
    // public static deleteById(): boolean {
    //   return false
    // }

    // public static find(): T | T[] {
    //   return {} as T
    // }
    // public static findBy(key: KeyOf<T>, value: any): T | T[] {
    //   return {} as T
    // }
    // public static findById(): T {
    //   return {} as T
    // }
    // public static findOne(): T {
    //   return {} as T
    // }
    // public static findOneBy(): T {
    //   return {} as T
    // }

    // public static updateMany(): T[] {
    //   return [{}] as T[]
    // }
    // public static updateOne(): T {
    //   return {} as T
    // }
    // public static updateOneBy(): T {
    //   return {} as T
    // }
  }
}

const test = createModel<IUser>('user', UserKeys, {} as Pool)
