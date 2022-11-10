import { FieldPacket, OkPacket, Pool, RowDataPacket } from 'mysql2/promise'
import {
  Alias,
  AliasModel,
  InsertOptions,
  KeyOf,
  ModelKeys,
  ModelType,
  QueryType,
  SelectOptions,
  SQLModelType,
  Where,
  WhereOptions,
} from './'
import { aliasModel } from './aliasModel'
import { formatValue, getIdKey, getInsertKeys, getInsertValues, parseOptions } from './utils'

export function createModel<T>(
  name: string,
  keys: ModelKeys<T>,
  connection: Pool,
  schema: string
): ModelType<T> {
  const Keys: string[] = Object.keys(keys)

  const SQL = sql(name, keys)

  return class Model {
    data: T

    constructor(data: T) {
      this.data = data
    }

    public save = (options?: InsertOptions) =>
      connection.query<OkPacket>(SQL.insert(this.data, options)).then(([{ insertId }]) => {
        //  @ts-ignore
        this.data[getIdKey(keys)] = insertId
        return this.data
      })

    public static delete = (query: Where<T>, limit?: number): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(SQL.delete(query, limit))

    public static insert = (
      data: Partial<T> | Partial<T>[],
      options?: InsertOptions
    ): Promise<[OkPacket, FieldPacket[]]> => connection.query<OkPacket>(SQL.insert(data, options))

    public static select = (query?: SelectOptions<T>): Promise<[RowDataPacket[], FieldPacket[]]> =>
      connection.query<RowDataPacket[]>(SQL.select(query))

    public static truncate = (): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(SQL.truncate())

    public static update = (
      data: Partial<T>,
      query: WhereOptions<T>
    ): Promise<[OkPacket, FieldPacket[]]> => connection.query<OkPacket>(SQL.update(data, query))

    public static upsert = (data: T | T[]): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(SQL.upsert(data))

    public static SQL = () => SQL

    public static as = <A extends string>(alias: A): AliasModel<Alias<T, A>> =>
      aliasModel<Alias<T, A>>(alias, name, (<unknown>keys) as ModelKeys<Alias<T, A>>, connection)

    public static create = (data: Partial<T>, options?: InsertOptions): Promise<Partial<T>> =>
      this.insert(data, options).then(([{ insertId }]) => ({
        ...data,
        [getIdKey(keys)]: insertId,
      }))
    public static createOne = this.create
    public static createMany = (
      data: Partial<T>[],
      options?: InsertOptions
    ): Promise<Partial<T>[]> =>
      this.insert(data, options).then(([{ insertId }]) =>
        data.map((item: Partial<T>, index: number) => ({
          ...item,
          [getIdKey(keys)]: insertId + index,
        }))
      )

    public static deleteBy = (key: KeyOf<T>, query: QueryType<T>): Promise<number> =>
      //  @ts-ignore
      this.delete({ [key]: query }).then(([{ affectedRows }]) => affectedRows)
    public static deleteById = (id: number): Promise<boolean> =>
      //  @ts-ignore
      this.delete({ [getIdKey(keys)]: id }).then(([{ affectedRows }]) => affectedRows === 1)
    public static deleteOne = (query: Where<T>): Promise<boolean> =>
      this.delete(query, 1).then(([{ affectedRows }]) => affectedRows === 1)
    public static deleteOneBy = (key: KeyOf<T>, query: QueryType<T>): Promise<boolean> =>
      //  @ts-ignore
      this.delete({ [key]: query }, 1).then(([{ affectedRows }]) => affectedRows === 1)

    public static find = (query?: Where<T>): Promise<T[]> =>
      this.select({ $where: query }).then(([rows]) => rows as T[])
    public static findBy = (key: KeyOf<T>, query: QueryType<T>): Promise<T[]> =>
      //  @ts-ignore
      this.select({ $where: { [key]: query } }).then(([rows]) => rows as T[])
    public static findById = (id: number): Promise<T | null> =>
      //  @ts-ignore
      this.select({ $where: { [getIdKey(keys)]: id } }).then(([rows]) =>
        rows.length ? (rows[0] as T) : null
      )
    public static findOne = (query?: Where<T>): Promise<T | null> =>
      this.select({ $where: query, $limit: 1 }).then(([rows]) =>
        rows.length ? (rows[0] as T) : null
      )
    public static findOneBy = (key: KeyOf<T>, query: QueryType<T>): Promise<T | null> =>
      //  @ts-ignore
      this.select({ $where: { [key]: query }, $limit: 1 }).then(([rows]) =>
        rows.length ? (rows[0] as T) : null
      )

    public static insertIgnore = (
      data: Partial<T> | Partial<T>[]
    ): Promise<Partial<T> | Partial<T>[]> =>
      this.insert(data, { ignore: true }).then(([{ insertId }]) =>
        Array.isArray(data)
          ? data.map((item, index) => ({ ...item, [getIdKey(keys)]: insertId + index }))
          : { ...data, [getIdKey(keys)]: insertId }
      )

    public static upsertOne = (data: T): Promise<boolean> =>
      this.upsert(data).then(([{ affectedRows }]) => affectedRows === 1)

    public static upsertMany = (data: T[]): Promise<boolean> =>
      this.upsert(data).then(([{ affectedRows }]) => affectedRows > 0)
  }
}

export function sql<T>(name: string, keys: ModelKeys<T>): SQLModelType<T> {
  const Keys: string[] = Object.keys(keys)

  return {
    delete: (query: Where<T>, limit?: number): string =>
      `DELETE FROM \`${name}\` WHERE ${parseOptions(query, Keys)}${limit ? ` LIMIT ${limit}` : ''}`,

    insert(data: Partial<T> | Partial<T>[], options?: InsertOptions): string {
      const insertKeys: string[] = getInsertKeys(data)
      const insertValues: string = getInsertValues(data, insertKeys)
      return `INSERT${options?.ignore ? ' IGNORE' : ''} INTO \`${name}\` (${insertKeys
        .map((k) => `\`${k}\``)
        .join(', ')}) ${insertValues}`
    },

    select(query?: SelectOptions<T>): string {
      const sql: string[] = [`SELECT ${query?.$columns?.join(', ') || '*'} FROM \`${name}\``]
      query?.$where && sql.push(`WHERE ${parseOptions(query.$where, Keys)}`)
      query?.$groupBy &&
        sql.push(
          `GROUP BY ${Array.isArray(query.$groupBy) ? query.$groupBy.join(', ') : query.$groupBy}`
        )
      query?.$orderBy &&
        sql.push(
          `ORDER BY ${Array.isArray(query.$orderBy) ? query.$orderBy.join(', ') : query.$orderBy}`
        )
      query?.$limit &&
        sql.push(`LIMIT ${Array.isArray(query.$limit) ? query.$limit.join(', ') : query.$limit}`)
      return sql.join(' ')
    },

    truncate: (): string => `TRUNCATE TABLE \`${name}\``,

    update: (data: Partial<T>, query: WhereOptions<T>): string =>
      `UPDATE \`${name}\` SET ${parseOptions(data, Keys).replace(
        / AND /,
        ', '
      )} WHERE ${parseOptions(query, Keys)}`,

    upsert(data: T | T[]) {
      const insertKeys = getInsertKeys<Partial<T>>(data)
      const insertValues = getInsertValues<Partial<T>>(data, insertKeys)
      const sql: string[] = [
        `INSERT INTO \`${name}\` (${insertKeys.map((k) => `\`${k}\``).join(', ')}) ${insertValues}`,
      ]

      Array.isArray(data) && sql.push('AS MANY')
      sql.push(`ON DUPLICATE KEY UPDATE`)
      const rows: string[] = []

      insertKeys
        .filter((key) => !keys[key]?.primaryKey)
        .forEach((key) =>
          //  @ts-ignore
          rows.push(`\`${key}\` = ${Array.isArray(data) ? `MANY.${key}` : formatValue(data[key])}`)
        )
      sql.push(rows.join(', '))
      return sql.join(' ')
    },
  }
}
