import { ModelClass, ModelKeys, ModelType } from './@types/model'
import { createPool } from 'mysql2/promise'

import { ConnectionOptions, KeyOf, SchemaType } from './@types'
import model from 'model'

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
    addModel<T>({ keys, model, name }: ModelType<T>) {
      const key = name as KeyOf<T>
      //  @ts-ignore
      this.models[key] = keys
      return model
    },
  }
}

export default Schema
