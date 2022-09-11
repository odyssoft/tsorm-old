import { createModel } from 'model'
import { createPool, Pool } from 'mysql2/promise'

import { ConnectionOptions, KeyOf, ModelKeys, Models, ModelsKeys, SchemaType } from './types'

export class Schema<T extends Models<T>> {
  public models: Models<T> = {} as Models<T>
  public name: string
  public connection: Pool
  constructor(name: string, connection: ConnectionOptions) {
    this.name = name
    this.connection = createPool({
      ...connection,
      multipleStatements: true,
    })
    // this.models = models
  }

  addModel<S>(name: KeyOf<T>, keys: ModelKeys<S>) {
    this.models[name] = createModel(name, keys, this.connection)

    return this.models[name]
  }
}

// export function createSchema<T>(
//   name: string,
//   options: ConnectionOptions,
//   models: ModelsKeys<T>
// ): SchemaType<T> {
//   const connection = createPool({
//     ...options,
//     multipleStatements: true,
//   })
//   const queries: string[] = []
//   connection
//     .query(`CREATE DATABASE IF NOT EXISTS \`${name}\`; USE \`${name}\`;`)
//     .then(() => createTables())
//     .catch((error: any) => {
//       connection.end()
//       console.error({ error })
//     })

//   const createModels = () => {
//     const model: Models<T> = {} as Models<T>
//     for (const m in models) {
//       model[m] = createModel(m.toString(), models[m], connection)
//       queries.push(
//         `CREATE TABLE IF NOT EXISTS ${models[m].name} (${Object.keys(models[m].keys)
//           .map((key) => mapKey(key, models[m].keys[key]))
//           .join(', ')})`
//       )
//     }

//     return models
//   }

//   const createTables = () => {
//     connection.query(queries.join(';')).catch((error: any) => {
//       connection.end()
//       console.error({ error })
//     })
//   }

//   return {
//     connection,
//     models: createModels(),
//     name,

//     close() {
//       connection.end()
//     },
//   }
// }
