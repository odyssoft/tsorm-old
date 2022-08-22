import { Builder } from './types/builder'
import operator, { formatValue } from './operator'
import { JoinModelType, ModelType, SelectOptions, UpdateOptions, Where } from './types'

export function builder<T>({
  alias,
  joins,
  name,
  ...rest
}: ModelType<T> | JoinModelType<T>): Builder<T> {
  const table = `\`${name}\`${alias ? ` AS ${alias}` : ''}`
  const keys: string[] = []
  Object.keys(rest.keys).forEach((key: string) => keys.push(`${alias ? `${alias}.` : ''}${key}`))
  joins.forEach(({ model }: any) => {
    Object.keys(model.keys).forEach((key: string) =>
      keys.push(`${model.alias ? `${model.alias}.` : ''}${key}`)
    )
  })
  return {
    delete(options: Where<T>) {
      const sql: string = `DELETE FROM ${table} WHERE ${parseOptions(options, keys)}`
      return rest.connection.query(sql)
    },

    insert(data: T | T[]) {
      const keys: string[] = getInsertKeys<T>(data)
      const sql: string = `INSERT INTO ${table} (${keys.join(', ')}) ${getInsertValues<T>(
        data,
        keys
      )}`
      return rest.connection.query(sql)
    },

    select(options?: SelectOptions<T> | undefined) {
      const sql: string[] = [
        `SELECT ${options?.$columns ? options.$columns.join(', ') : '*'} FROM ${table}`,
      ]

      joins.forEach(({ model, options: joinOptions }: any) => {
        sql.push(
          `INNER JOIN \`${model.name}\` AS ${model.alias} ON ${parseOptions(joinOptions, keys)}`
        )
      })

      options?.$where && sql.push(`WHERE ${parseOptions(options.$where, keys)}`)

      return rest.connection.query(sql.join(' '))
    },

    truncate() {
      return rest.connection.query(`TRUNCATE TABLE \`${name}\``)
    },

    update(data: Partial<T>, options: UpdateOptions<T>) {
      const sql: string[] = [`UPDATE ${table} SET`]
      const values = Object.keys(data).map((key) => parseValue(key, (data as any)[key], keys))
      sql.push(values.join(', '))
      sql.push(`WHERE ${parseOptions(options, keys)}`)
      return rest.connection.query(sql.join(' '))
    },

    upsert(data: T | T[]) {
      const keys: string[] = getInsertKeys<T>(data)
      const sql: string[] = [
        `INSERT INTO ${table} (${keys.join(', ')}) ${getInsertValues<T>(data, keys)}`,
      ]

      Array.isArray(data) && sql.push('AS MANY')
      sql.push(`ON DUPLICATE KEY UPDATE`)
      const rows: string[] = []

      keys
        .filter((key) => !rest.keys[key].primaryKey)
        .forEach((key) =>
          //  @ts-ignore
          rows.push(`${key} = ${Array.isArray(data) ? `MANY.${key}` : formatValue(data[key])}`)
        )
      sql.push(rows.join(', '))
      return rest.connection.query(sql.join(' '))
    },
  }
}

export const getInsertKeys = <T>(data: T | T[]): string[] => {
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

  return keys
}

export const getInsertValues = <T>(data: T | T[], keys: string[]): string => {
  const sql: string[] = ['VALUES']
  const rows: any | any[] = data
  if (Array.isArray(rows)) {
    const insert: string[] = []
    rows.forEach((row) => insert.push(`(${keys.map((k) => formatValue(row[k])).join(', ')})`))
    sql.push(insert.join(', '))
  } else {
    sql.push(`(${keys.map((k) => formatValue(rows[k])).join(', ')})`)
  }

  return sql.join(' ')
}

export const parseOptions = (options: any, keys?: string[]): string =>
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

export const parseValue = (key: string, value: any, keys?: string[]): string => {
  if (value === null) {
    return `${key} IS NULL`
  }
  if (typeof value !== 'object') {
    return `${key} = ${formatValue(value, keys)}`
  }
  const Operator: any = operator(key, keys)
  const [id] = Object.keys(value)
  return Operator[id](value[id])
}
