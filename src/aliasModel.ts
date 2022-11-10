import { Pool, RowDataPacket } from 'mysql2/promise'

import {
  Alias,
  AliasModel,
  Join,
  JoinOptions,
  ModelKeys,
  OnJoin,
  SelectOptions,
  SQLAliasModel,
} from './types'
import { parseOptions } from './utils'

export function aliasModel<T>(
  alias: string,
  name: string,
  keys: ModelKeys<T>,
  connection: Pool
): AliasModel<T> {
  return {
    alias,
    keys: Object.keys(keys).map((key) => `${alias}.${key}`),
    name,
    joins: [],
    SQL() {
      return sql(alias, name, this.keys, this.joins)
    },

    join<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      join: Join,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      this.keys.push(...model.keys)
      this.joins.push(
        `${join} JOIN \`${model.name}\` AS ${model.alias} ON ${parseOptions(on, this.keys)}`
      )
      return <AliasModel<T & Alias<S, AA>>>(<any>{
        ...this,
        SQL() {
          return sql(alias, name, this.keys, this.joins)
        },
      })
    },

    crossJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'CROSS', on)
    },

    innerJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'INNER', on)
    },

    leftJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'LEFT', on)
    },

    leftOuterJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'LEFT OUTER', on)
    },

    rightJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'RIGHT', on)
    },

    rightOuterJoin<S, AA extends string>(
      model: AliasModel<Alias<S, AA>>,
      on: OnJoin<T & Alias<S, AA>>
    ): AliasModel<T & Alias<S, AA>> {
      return this.join<S, AA>(model, 'RIGHT OUTER', on)
    },

    select(query?: SelectOptions<T>): Promise<T[]> {
      return connection
        .query<RowDataPacket[]>(this.SQL().select(query))
        .then(([rows]) => rows as T[])
    },
  }
}

export function sql<T>(alias: string, name: string, keys: [], joins: []): SQLAliasModel<T> {
  return {
    select(query?: SelectOptions<T>): string {
      const sql: string[] = [
        `SELECT ${query?.$columns?.join(', ') ?? '*'} FROM \`${name}\` AS ${alias}`,
      ]
      joins.length && sql.push(joins.join(' '))
      query?.$where && sql.push(`WHERE ${parseOptions(query.$where, keys)}`)
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
  }
}
