import { aliasModel } from 'aliasModel'
import { FieldPacket, Pool, RowDataPacket } from 'mysql2/promise'

import { Alias, AliasModel, ModelKeys, SelectOptions, SQLViewType, ViewType } from './types'
import { parseOptions } from './utils'

export function createView<T>(
  name: string,
  keys: string[],
  connection: Pool,
  schema: string
): ViewType<T> {
  const table = `\`${schema}\`.\`${name}\``
  const SQL = sql(table, keys)
  return class View {
    public static select = (query?: SelectOptions<T>): Promise<[RowDataPacket[], FieldPacket[]]> =>
      connection.query<RowDataPacket[]>(SQL.select(query))

    public static SQL = () => SQL

    public static as = <A extends string>(alias: A): AliasModel<Alias<T, A>> => {
      const Keys: any = {}
      keys.forEach((key) => (Keys[key] = {}))
      return aliasModel<Alias<T, A>>(
        alias,
        table,
        (<unknown>Keys) as ModelKeys<Alias<T, A>>,
        connection
      )
    }
  }
}

export const sql = <T>(name: string, keys: string[]): SQLViewType<T> => ({
  select(query?: SelectOptions<T>): string {
    const sql: string[] = [`SELECT ${query?.$columns?.join(', ') || '*'} FROM ${name}`]
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
})
