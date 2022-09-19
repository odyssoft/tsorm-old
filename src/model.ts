import { FieldPacket, OkPacket, Pool, RowDataPacket } from 'mysql2/promise'
import {
  Alias,
  AliasModel,
  Join,
  JoinObject,
  JoinOptions,
  KeyOf,
  ModelKeys,
  QueryType,
  SelectOptions,
  Where,
  WhereOptions,
} from './'
import { formatValue, getIdKey, getInsertKeys, getInsertValues, parseOptions } from './utils'

export function createModel<T>(name: string, keys: ModelKeys<T>, connection: Pool) {
  const Keys: string[] = Object.keys(keys)

  return class Model {
    data: T
    constructor(data: T) {
      this.data = data
    }

    public save = (): Promise<T> => {
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

    public static as = <A extends string>(alias: A) =>
      aliasModel<Alias<T, A>>(alias, name, keys as ModelKeys<Alias<T, A>>, connection)

    public static insert = (data: T | T[]): Promise<[OkPacket, FieldPacket[]]> => {
      const insertKeys: string[] = getInsertKeys(data)
      const insertValues: string = getInsertValues(data, insertKeys)
      return connection.query<OkPacket>(
        `INSERT INTO \`${name}\` (${insertKeys.join(', ')}) ${insertValues}`
      )
    }

    public static create = (data: T): Promise<T> =>
      this.insert(data).then(([{ insertId }]) => ({
        ...data,
        [getIdKey(keys)]: insertId,
      }))

    public static createMany = (data: T[]): Promise<T[]> =>
      this.insert(data).then(([{ insertId }]) =>
        data.map((item: T, index: number) => ({
          ...item,
          [getIdKey(keys)]: insertId + index,
        }))
      )

    public static delete = (query: Where<T>, limit?: number): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(
        `DELETE FROM \`${name}\` WHERE ${parseOptions(query, Keys)}${
          limit ? ` LIMIT ${limit}` : ''
        }`
      )

    public static deleteBy = (key: KeyOf<T>, query: QueryType<T>): Promise<number> =>
      //  @ts-ignore
      this.delete({ [key]: query })
    public static deleteById = (id: number): Promise<boolean> =>
      //  @ts-ignore
      this.delete({ [getIdKey(keys)]: id }).then(([{ affectedRows }]) => affectedRows === 1)
    public static deleteOne = (query: Where<T>): Promise<boolean> =>
      this.delete(query, 1).then(([{ affectedRows }]) => affectedRows === 1)
    public static deleteOneBy = (key: KeyOf<T>, query: QueryType<T>): Promise<boolean> =>
      //  @ts-ignore
      this.delete({ [key]: query }, 1).then(([{ affectedRows }]) => affectedRows === 1)

    public static find = (query?: Where<T>): Promise<T[]> =>
      //  @ts-ignore
      this.select({ $where: query }).then(([rows]) => rows as T[])
    public static findBy = (key: KeyOf<T>, query: QueryType<T>): Promise<T[]> =>
      //  @ts-ignore
      this.select({ $where: { [key]: query } }).then(([rows]) => rows as T[])
    public static findById = (id: number): Promise<T> =>
      //  @ts-ignore
      this.select({ $where: { [getIdKey(keys)]: id } }).then(([rows]) => rows[0] as T)
    public static findOne = (query?: Where<T>): Promise<T> =>
      //  @ts-ignore
      this.select({ $where: query }, 1).then(([rows]) => rows[0] as T)
    public static findOneBy = (key: KeyOf<T>, query: QueryType<T>): Promise<T> =>
      //  @ts-ignore
      this.select({ $where: { [key]: query } }, 1).then(([rows]) => rows[0] as T)

    public static select = (
      query?: SelectOptions<T>,
      limit?: number
    ): Promise<[RowDataPacket[], FieldPacket[]]> => {
      const sql: string[] = [`SELECT ${query?.$columns?.join(', ') || '*'} FROM \`${name}\``]
      query?.$where && sql.push(`WHERE ${parseOptions(query.$where, Keys)}`)
      limit && sql.push(`LIMIT ${limit}`)
      return connection.query<RowDataPacket[]>(sql.join(' '))
    }

    public static truncate = (): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(`TRUNCATE TABLE \`${name}\``)

    public static update = (
      data: Partial<T>,
      query: WhereOptions<T>
    ): Promise<[OkPacket, FieldPacket[]]> =>
      connection.query<OkPacket>(
        `UPDATE \`${name}\` SET ${parseOptions(data, Keys)} WHERE ${parseOptions(query, Keys)}`
      )

    public static upsert = (data: T | T[]): Promise<[OkPacket, FieldPacket[]]> => {
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

    public static upsertOne = (data: T): Promise<boolean> =>
      this.upsert(data).then(([{ affectedRows }]) => affectedRows === 1)

    public static upsertMany = (data: T[]): Promise<boolean> =>
      this.upsert(data).then(([{ affectedRows }]) => affectedRows > 0)
  }
}

export function aliasModel<T>(
  alias: string,
  name: string,
  keys: ModelKeys<T>,
  connection: Pool
): AliasModel<T> {
  return {
    joins: [],
    keys,
    join<S, AA extends string>(
      alias: AliasModel<Alias<S, AA>>,
      join: Join,
      on: JoinOptions<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      this.joins.push({})
      return <AliasModel<T & Alias<S, AA>>>(<any>this)
    },
  }
}
/*
as<A extends string>(alias: A): AliasModelType<T, A> {
  this.alias = alias
  return <AliasModelType<T, A>>(<any>{
    ...this,
    join<S, AA extends string>(
      model: AliasModelType<S, AA>,
      options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
    ) {
      return join<AliasModelType<T, A>, AliasModelKeys<T, A>, S, AA>(
        <ModelType<AliasModelType<T, A>>>(<any>this),
        model,
        options
      )
    },
  })
},

function join<T, K, S, A extends string>(
  original: ModelType<T>,
  model: AliasModelType<S, A>,
  options: JoinOptions<K & AliasModelKeys<S, A>>
): ModelType<K & AliasModelKeys<S, A>> {
  original.joins.push({ model, options })
  return <ModelType<K & AliasModelKeys<S, A>>>(<any>original)
}

*/
