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

export const mapKey = (key: string, options: ColumnOptions) => {
  const tableKey: string[] = [`\`${key}\``]
  tableKey.push(`${options.type}${options.length ? `(${options.length})` : ''}`)
  options.autoIncrement && tableKey.push('AUTO_INCREMENT')
  options.primaryKey && tableKey.push('PRIMARY KEY')
  options.required && tableKey.push('NOT NULL')
  options.default !== undefined &&
    tableKey.push(
      `DEFAULT ${typeof options.default === 'string' ? `'${options.default}'` : options.default}`
    )
  return tableKey.join(' ')
}

export default Schema
