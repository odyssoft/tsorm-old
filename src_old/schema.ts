import { createPool } from 'mysql2/promise'

import { ConnectionOptions, Models, SchemaType } from './types'
import { mapKey } from './utils'

export function createSchema<T>(
  name: string,
  options: ConnectionOptions,
  models: Models<T>
): SchemaType<T> {
  const connection = createPool({
    ...options,
    multipleStatements: true,
  })

  const queries: string[] = []

  connection
    .query(`CREATE DATABASE IF NOT EXISTS \`${name}\`; USE \`${name}\`;`)
    .then(() => createTables())
    .catch((error: any) => {
      connection.end()
      console.error({ error })
    })

  for (const m in models) {
    models[m].connection = connection
    queries.push(
      `CREATE TABLE IF NOT EXISTS ${models[m].name} (${Object.keys(models[m].keys)
        .map((key) => mapKey(key, models[m].keys[key]))
        .join(', ')})`
    )
  }

  const createTables = () => {
    connection.query(queries.join(';')).catch((error: any) => {
      connection.end()
      console.error({ error })
    })
  }

  return {
    connection,
    models,
    name,

    close() {
      connection.end()
    },
  }
}

export default createSchema
