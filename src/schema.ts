import { createPool } from 'mysql2/promise'

import { ConnectionOptions, ModelType, SchemaType } from './types'
import { mapKey } from './utils'

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

    addModel<T>(model: ModelType<T>): any {
      connection.query(
        `CREATE TABLE IF NOT EXISTS ${model.name} (${Object.keys(model.keys)
          .map((key) => `${key} ${mapKey(key, model.keys[key])}`)
          .join(', ')})`
      )
      // @ts-ignore
      this.models[model.name] = model.keys
      model.connection = connection
      return model
    },
  }
}

export default Schema
