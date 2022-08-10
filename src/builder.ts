import {
  DeleteOptions,
  InsertOptions,
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

export function builder<T>(
  model: ModelType<T>,
  options?: DeleteOptions<T> | InsertOptions<T> | SelectOptions<T> | UpdateOptions<T>
): Builder<T> {
  return {
    delete: (options: DeleteOptions<T>) => {
      const sql: string[] = [`DELETE FROM ${model.name}`]
      sql.push(parseWhere(options as Where<T>))
      return `DELETE FROM ${model.name}`
    },
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

const parseWhere = (options: any): string =>
  Object.keys(options as any)
    .map((key) => parseValue(key, options[key]))
    .join(' ')

const parseValue = (key: string, value: any): string => {
  const sql: string[] = []
  if (Array.isArray(value)) {
    value.forEach()
  }
  return ''
}
