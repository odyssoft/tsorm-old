import { formatValue, getInsertKeys, getInsertValues, parseOptions, parseValue } from './utils'
import {
  AliasModelKeys,
  AliasModelType,
  JoinOptions,
  ModelKeys,
  ModelType,
  SelectOptions,
  Where,
} from './types'
import { OkPacket } from 'mysql2'

export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    joins: [],
    keys,
    name,

    getKeys(): string[] {
      const keys: string[] = []
      Object.keys(this.keys).forEach((key: string) =>
        keys.push(`${this.alias ? `${this.alias}.` : ''}${key}`)
      )
      this.joins.forEach(({ model }: any) => {
        Object.keys(model.keys).forEach((key: string) =>
          keys.push(`${model.alias ? `${model.alias}.` : ''}${key}`)
        )
      })
      return keys
    },

    getTable(): string {
      return `\`${name}\`${this.alias ? ` AS ${this.alias}` : ''}`
    },

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

    delete(options: Where<T>) {
      const sql: string = `DELETE FROM ${this.getTable()} WHERE ${parseOptions(
        options,
        this.getKeys()
      )}`
      return this.connection?.query(sql)
    },

    insert(data: T | T[]) {
      const keys: string[] = getInsertKeys<T>(data)
      const sql: string = `INSERT INTO ${this.getTable()} (${keys.join(', ')}) ${getInsertValues<T>(
        data,
        keys
      )}`
      return this.connection.query(sql)
    },

    select(options?: SelectOptions<T>) {
      const sql: string[] = [
        `SELECT ${options?.$columns ? options.$columns.join(', ') : '*'} FROM ${this.getTable()}`,
      ]

      this.joins.forEach(({ model, options: joinOptions }: any) => {
        sql.push(
          `INNER JOIN \`${model.name}\` AS ${model.alias} ON ${parseOptions(
            joinOptions,
            this.getKeys()
          )}`
        )
      })

      options?.$where && sql.push(`WHERE ${parseOptions(options.$where, this.getKeys())}`)

      return this.connection.query(sql.join(' '))
    },

    truncate() {
      return this.connection.query(`TRUNCATE TABLE \`${name}\``)
    },

    update(data: Partial<T>, options: Where<T>) {
      const sql: string[] = [`UPDATE ${this.getTable()} SET`]
      const values = Object.keys(data).map((key) =>
        parseValue(key, (data as any)[key], this.getKeys())
      )
      sql.push(values.join(', '))
      sql.push(`WHERE ${parseOptions(options, this.getKeys())}`)
      return this.connection.query(sql.join(' '))
    },

    upsert(data: Partial<T> | Partial<T>[]) {
      const keys: string[] = getInsertKeys<Partial<T>>(data)
      const sql: string[] = [
        `INSERT INTO ${this.getTable()} (${keys.join(', ')}) ${getInsertValues<Partial<T>>(
          data,
          keys
        )}`,
      ]

      Array.isArray(data) && sql.push('AS MANY')
      sql.push(`ON DUPLICATE KEY UPDATE`)
      const rows: string[] = []

      keys
        .filter((key) => !this.keys[key].primaryKey)
        .forEach((key) =>
          //  @ts-ignore
          rows.push(`${key} = ${Array.isArray(data) ? `MANY.${key}` : formatValue(data[key])}`)
        )
      sql.push(rows.join(', '))
      //  @ts-ignore
      return this.connection.query<OkPacket>(sql.join(' '))
    },
  }
}

function join<T, K, S, A extends string>(
  original: ModelType<T>,
  model: AliasModelType<S, A>,
  options: JoinOptions<K & AliasModelKeys<S, A>>
): ModelType<K & AliasModelKeys<S, A>> {
  original.joins.push({ model, options })
  return <ModelType<K & AliasModelKeys<S, A>>>(<any>original)
}
