import { ColumnOptions, ConnectionOptions, ModelType, SchemaType } from './types'
import { createPool } from 'mysql2/promise'

export function Schema<T>(name: string, options: ConnectionOptions): SchemaType<T> {
  const connection = createPool(options)
  connection.query(`CREATE DATABASE IF NOT EXISTS ${name}; USE ${name}`).catch((error: any) => {
    console.error({ error: error.toString() })
    connection.end()
  })

  return {
    connection,
    name,
    models: {},
    close() {
      connection.end()
    },
    addModel<T>(model: ModelType<T>): ModelType<T> {
      const sql: string[] = [`CREATE TABLE IF NOT EXISTS ${model.name} (`]
      const columns: string[] = []
      Object.keys(model.keys).forEach((key) =>
        columns.push(`${key} ${mapKey(key, model.keys[key])}`)
      )
      sql.push(`${columns.join(', ')} )`)
      connection.query(sql.join(' '))
      // @ts-ignore
      this.models[model.name] = model.keys
      model.connection = connection
      return model
    },
  }
}

export const mapKey = (
  key: string,
  { type, autoIncrement, default: def, length, primaryKey, required }: ColumnOptions
) => {
  const tableKey: string[] = [`\`${key}\``]
  tableKey.push(`${type}${length ? `(${length})` : ''}`)
  autoIncrement && tableKey.push('AUTO_INCREMENT')
  primaryKey && tableKey.push('PRIMARY KEY')
  required && tableKey.push('NOT NULL')
  def && tableKey.push(`DEFAULT ${def}`)
  return tableKey.join(' ')
}

export default Schema
