import { FieldPacket, OkPacket, Pool, RowDataPacket } from 'mysql2/promise'
import {
  formatValue,
  getIdKey,
  getInsertKeys,
  getInsertValues,
  KeyOf,
  ModelKeys,
  parseOptions,
  QueryType,
  SelectOptions,
  Where,
  WhereOptions,
} from './'

export function createModel<T>(name: string, keys: ModelKeys<T>, connection: Pool) {
  return class Model {
    data: T
    constructor(data: T) {
      this.data = data
    }

    static getKeys(): string[] {
      const outKeys: string[] = []
      Object.keys(keys).forEach((key: string) => outKeys.push(key))
      return outKeys
    }

    public save(): Promise<T> {
      const insertKeys: string[] = getInsertKeys(this.data)
      const insertValues: string = getInsertValues(this.data, insertKeys)
      return connection
        .query<OkPacket>(`INSERT INTO \`${name}\` (${insertKeys.join(', ')}) ${insertValues}`)
        .then(([{ insertId }]) => {
          //  @ts-ignore
          this.data[getIdKey(keys)] = insertId
          return this.data
        })
    }

    public static insert(data: T | T[]): Promise<[OkPacket, FieldPacket[]]> {
      const insertKeys: string[] = getInsertKeys(data)
      console.log({ data, insertKeys })
      const insertValues: string = getInsertValues(data, insertKeys)
      return connection.query<OkPacket>(
        `INSERT INTO \`${name}\` (${insertKeys.join(', ')}) ${insertValues}`
      )
    }

    public static create(data: T): Promise<T> {
      return this.insert(data).then(([{ insertId }]) => ({
        ...data,
        [getIdKey(keys)]: insertId,
      }))
    }

    public static createMany(data: T[]): Promise<T[]> {
      return this.insert(data).then(([{ insertId }]) =>
        data.map((item: T, index: number) => ({
          ...item,
          [getIdKey(keys)]: insertId + index,
        }))
      )
    }

    public static delete(query: Where<T>, limit?: number): Promise<number> {
      return connection
        .query<OkPacket>(
          `DELETE FROM \`${name}\` WHERE ${parseOptions(query, this.getKeys())}${
            limit ? ` LIMIT ${limit}` : ''
          }`
        )
        .then(([{ affectedRows }]) => affectedRows)
    }

    public static deleteBy(key: KeyOf<T>, query: QueryType<T>): Promise<number> {
      //  @ts-ignore
      return this.delete({ [key]: query })
    }
    public static deleteById(id: number): Promise<boolean> {
      //  @ts-ignore
      return this.delete({ [getIdKey(keys)]: id }).then((count) => count === 1)
    }
    public static deleteOne(query: Where<T>): Promise<boolean> {
      return this.delete(query, 1).then((count) => count === 1)
    }
    public static deleteOneBy(key: KeyOf<T>, query: QueryType<T>): Promise<boolean> {
      //  @ts-ignore
      return this.delete({ [key]: query }, 1).then((count) => count === 1)
    }
    public static find(query?: SelectOptions<T>): Promise<T[]> {
      //  @ts-ignore
      return this.select({ $where: query }).then(([rows]) => rows as T[])
    }
    public static findBy(key: KeyOf<T>, query: QueryType<T>): Promise<T[]> {
      //  @ts-ignore
      return this.select({ $where: { [key]: query } }).then(([rows]) => rows as T[])
    }
    public static findById(id: number): Promise<T> {
      //  @ts-ignore
      return this.select({ $where: { [getIdKey(keys)]: id } }).then(([rows]) => rows[0] as T)
    }
    public static findOne(query?: SelectOptions<T>): Promise<T> {
      //  @ts-ignore
      return this.select({ $where: query }, 1).then(([rows]) => rows[0] as T)
    }
    public static findOneBy(key: KeyOf<T>, query: QueryType<T>): Promise<T> {
      //  @ts-ignore
      return this.select({ $where: { [key]: query } }, 1).then(([rows]) => rows[0] as T)
    }

    public static select(
      query?: SelectOptions<T>,
      limit?: number
    ): Promise<[RowDataPacket[], FieldPacket[]]> {
      const sql: string[] = [`SELECT ${query?.$columns?.join(', ') || '*'} FROM \`${name}\``]
      query?.$where && sql.push(`WHERE ${parseOptions(query.$where, this.getKeys())}`)
      limit && sql.push(`LIMIT ${limit}`)
      return connection.query<RowDataPacket[]>(sql.join(' '))
    }

    public static truncate(): Promise<[OkPacket, FieldPacket[]]> {
      return connection.query<OkPacket>(`TRUNCATE TABLE \`${name}\``)
    }

    public static update(data: Partial<T>, query: WhereOptions<T>): Promise<boolean> {
      return connection
        .query<OkPacket>(
          `UPDATE \`${name}\` SET ${parseOptions(data, this.getKeys())} WHERE ${parseOptions(
            query,
            this.getKeys()
          )}`
        )
        .then(([{ affectedRows }]) => affectedRows > 0)
    }

    public static upsert(data: T | T[]): Promise<[OkPacket, FieldPacket[]]> {
      const insertKeys = getInsertKeys<Partial<T>>(data)
      const insertValues = getInsertValues<Partial<T>>(data, insertKeys)
      const sql: string[] = [`INSERT INTO \`${name}\` (${insertKeys.join(', ')}) ${insertValues}`]

      Array.isArray(data) && sql.push('AS MANY')
      sql.push(`ON DUPLICATE KEY UPDATE`)
      const rows: string[] = []

      insertKeys
        .filter((key) => !keys[key].primaryKey)
        .forEach((key) =>
          //  @ts-ignore
          rows.push(`${key} = ${Array.isArray(data) ? `MANY.${key}` : formatValue(data[key])}`)
        )
      sql.push(rows.join(', '))
      return connection.query<OkPacket>(sql.join(' '))
    }

    public static upsertOne(data: T): Promise<boolean> {
      return this.upsert(data).then(([{ affectedRows }]) => affectedRows === 1)
    }

    public static upsertMany(data: T[]): Promise<boolean> {
      return this.upsert(data).then(([{ affectedRows }]) => affectedRows > 0)
    }
  }
}
