import operator from './operator'
import {
  DeleteOptions,
  InsertOptions,
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

export function builder<T>(model: ModelType<T>): Builder<T> {
  return {
    delete: (options: DeleteOptions<T>) =>
      `DELETE FROM ${model.name} ${parseWhere(options as Where<T>, model.keys)}`,
    insert: (data: T | T[]) => {
      return `INSERT INTO ${model.name}`
    },
    select: (options?: SelectOptions<T>) => {
      return `SELECT * FROM ${model.name}`
    },
    update: (data: T | T[], options: UpdateOptions<T>) => {
      return `UPDATE ${model.name}`
    },
  }
}

export const parseWhere = <T>(options: any, keys?: ModelKeys<T>): string =>
  `WHERE ${Object.keys(options as any)
    .map((key) => {
      console.log({ test: options[key] })
      return Array.isArray(options[key])
        ? key === '$or'
          ? `(${options[key]
              .map((i: number) => parseValue(key, options[key][i], keys))
              .join(' OR ')})`
          : options[key].map((i: number) => parseValue(key, options[key][i], keys)).join(' AND ')
        : parseValue(key, options[key], keys)
    })
    .join(' ')}`

export const parseValue = <T>(key: string, value: any, keys?: ModelKeys<T>): string => {
  if (value === null) {
    return `${key} IS NULL`
  }
  if (typeof value !== 'object') {
    return `${key} = ${value}`
  }
  return parseOperator<T>(key, value, keys)
}

export const parseOperator = <T>(key: string, value: any, keys?: ModelKeys<T>): string => {
  const Operator: any = operator(key, keys)
  const [id] = Object.keys(value)
  return Operator[id](value[id])
}
