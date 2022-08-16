import operator from './operator'
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
  delete: (options: DeleteOptions<T>) => string
  insert: (data: T | T[]) => string
  select: (options?: SelectOptions<T>) => string
  update: (data: T | T[], options: UpdateOptions<T>) => string
}

export function builder<T>({ alias, connection, joins, keys, name }: ModelType<T>): Builder<T> {
  const table = `\`${name}\` ${alias ? `AS ${alias}` : ''}`
  return {
    delete(options: DeleteOptions<T>): string {
      const sql: string[] = [`DELETE FROM ${table}`]
      return sql.join(' ')
    },
    insert(data: T | T[]): string {
      const sql: string[] = [`INSERT INTO ${table}`]
      return sql.join(' ')
    },
    select(options?: SelectOptions<T> | undefined): string {
      const sql: string[] = [`SELECT * FROM ${table}`]
      return sql.join(' ')
    },
    update(data: T | T[], options: UpdateOptions<T>): string {
      const sql: string[] = [`UPDATE ${table}`]
      return sql.join(' ')
    },
  }
}

export function _builder<T>(model: ModelType<T>): Builder<T> {
  return {
    delete: (options: DeleteOptions<T>) =>
      `DELETE FROM ${model.name} ${parseWhere(options as Where<T>, model.keys)}`,
    insert: (data: T | T[]) => {
      const sql: string[] = [`INSERT INTO ${model.name} VALUES`]
      const values: string[] = []
      Array.isArray(data) ? data.forEach((item) => {}) : Object
      return `INSERT INTO \`${model.name}\``
    },
    select: (options?: SelectOptions<T>) => {
      return `SELECT ${options?.$columns ?? '*'} FROM ${model.name} ${
        model.joins.length > 0 && parseJoins(model.joins, model.keys)
      } ${options?.$where && parseWhere(options.$where, model.keys)}`
    },
    update: (data: T | T[], options: UpdateOptions<T>) => {
      return `UPDATE ${model.name} ${parseWhere(options as Where<T>, model.keys)}`
    },
  }
}

export const getKeysFromData = <T>(data: T | T[]): string[] => {
  const keys: string[] = []
  Array.isArray(data)
    ? data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (!keys.includes(key)) {
            keys.push(key)
          }
        })
      })
    : Object.keys(data).forEach((key) => keys.push(key))

  return keys
}

export const parseJoins = <T>(joins: any[], keys?: ModelKeys<T>): string =>
  joins
    .map(
      ({ model, options }) =>
        `INNER JOIN \`${model.name}\` AS ${model.alias} ON ${Object.keys(options as any).map(
          (key) => {
            Array.isArray(options[key])
              ? key === '$or'
                ? `(${options[key]
                    .map((i: number) => parseValue(key, options[key][i], keys))
                    .join(' OR ')})`
                : options[key]
                    .map((i: number) => parseValue(key, options[key][i], keys))
                    .join(' AND ')
              : parseValue(key, options[key], keys)
          }
        )}`
    )
    .join(' ')

export const parseWhere = <T>(options: any, keys?: ModelKeys<T>): string =>
  `WHERE ${Object.keys(options as any)
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
    return `${key} = ${value}`
  }
  const Operator: any = operator(key, keys)
  const [id] = Object.keys(value)
  return Operator[id](value[id])
}
