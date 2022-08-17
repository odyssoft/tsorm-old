import operator, { formatValue } from './operator'
import {
  DeleteOptions,
  InsertOptions,
  KeyOf,
  ModelKeys,
  ModelType,
  SelectOptions,
  UpdateOptions,
  Where,
} from './types'

type Builder<T> = {
  [key: string]: any
  delete: (options: Where<T>) => string
  insert: (data: T | T[]) => string
  select: (options?: SelectOptions<T>) => string
  truncate?: () => string
  update: (data: T | T[], options: UpdateOptions<T>) => string
  upsert?: (data: T | T[]) => string
}

export function builder<T>({ alias, connection, joins, keys, name }: ModelType<T>): Builder<T> {
  const table = `\`${name}\`${alias ? ` AS ${alias}` : ''}`
  return {
    delete(options: Where<T>): string {
      return `DELETE FROM ${table} WHERE ${parseOptions(options, keys)}`
    },

    insert(data: T | T[]): string {
      return `INSERT INTO ${table} ${parseInsert(data)}`
    },

    select(options?: SelectOptions<T> | undefined): string {
      const sql: string[] = [
        `SELECT ${options?.$columns ? options.$columns.join(', ') : '*'} FROM ${table}`,
      ]

      joins.forEach(({ model, joinOptions }: any) =>
        sql.push(
          `INNER JOIN \`${model.name}\` AS ${model.alias} ON ${parseOptions(
            joinOptions,
            model.keys
          )}`
        )
      )

      options?.$where && sql.push(`WHERE ${parseOptions(options.$where, keys)}`)

      return sql.join(' ')
    },

    update(data: T | T[], options: UpdateOptions<T>): string {
      const sql: string[] = [`UPDATE ${table} SET`]
      const parseData = () => {}
      return sql.join(' ')
    },
  }
}

export const parseInsert = <T>(data: T | T[]) => {
  const keys: string[] = []
  Array.isArray(data)
    ? data.forEach((d) => {
        Object.keys(d).forEach((key) => {
          if (!keys.includes(key)) {
            keys.push(key)
          }
        })
      })
    : keys.push(...Object.keys(data))

  const sql: string[] = [`(${keys.map((k) => `${k}`).join(', ')}) VALUES`]
  const rows: any | any[] = []
  Array.isArray(rows)
    ? rows.forEach((row) => {
        sql.push(`(${keys.map((k) => `${formatValue(row[k])}`).join(', ')})`)
      })
    : sql.push(`(${keys.map((k) => `${formatValue(rows[k])}`).join(', ')})`)

  return `(${keys.join(', ')}) VALUES (${keys.map((key) => formatValue(key)).join(', ')})`
}

export const parseOptions = <T>(options: any, keys?: ModelKeys<T>): string =>
  `${Object.keys(options as any)
    .map((key) =>
      Array.isArray(options[key])
        ? key === '$or'
          ? `(${options[key]
              .map((i: number) => parseValue(key, options[key][i], keys))
              .join(' OR ')})`
          : options[key].map((i: number) => parseValue(key, options[key][i], keys)).join(' AND ')
        : parseValue(key, options[key], keys)
    )
    .join(' ')}`

export const parseValue = <T>(key: string, value: any, keys?: ModelKeys<T>): string => {
  if (value === null) {
    return `${key} IS NULL`
  }
  if (typeof value !== 'object') {
    return `${key} = ${formatValue(value)}`
  }
  const Operator: any = operator(key, keys)
  const [id] = Object.keys(value)
  return Operator[id](value[id])
}
