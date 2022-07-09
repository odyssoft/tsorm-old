import { createPool } from 'mysql2/promise'

import { ConnectionOptions, SchemaType } from './@types'

function Schema<T>(name: string, options: ConnectionOptions): SchemaType<T> {
  const connection = createPool(options)
  connection.query(`CREATE DATABASE IF NOT EXISTS ${name}; USE ${name}`).catch((error: any) => {
    console.error({ error: error.toString() })
    connection.end()
  })

  return {
    connection,
    name,
    close() {
      connection.end()
    },
  }
}

export default Schema
