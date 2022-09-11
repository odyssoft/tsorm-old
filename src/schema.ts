import { createModel } from 'model'
import { createPool } from 'mysql2/promise'

import { ConnectionOptions, Models, ModelsKeys, SchemaType } from './types'

export function createSchema<T>(
  name: string,
  options: ConnectionOptions,
  models: ModelsKeys<T>
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

  const createModels = () => {
    const model: Models<T> = {} as Models<T>
    for (const m in models) {
      model[m] = createModel(m.toString(), models[m], connection)
      queries.push(
        `CREATE TABLE IF NOT EXISTS ${models[m].name} (${Object.keys(models[m].keys)
          .map((key) => mapKey(key, models[m].keys[key]))
          .join(', ')})`
      )
    }

    return models
  }

  const createTables = () => {
    connection.query(queries.join(';')).catch((error: any) => {
      connection.end()
      console.error({ error })
    })
  }

  return {
    connection,
    models: createModels(),
    name,

    close() {
      connection.end()
    },
  }
}
