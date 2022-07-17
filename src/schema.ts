import { AliasModelType, ConnectionOptions, ModelKeys, ModelType, SchemaType } from './types'
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
      //  @ts-ignore
      this.models[model.name] = model.keys
      return model
    },
  }
}

export default Schema
