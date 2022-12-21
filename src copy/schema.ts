import { createPool, OkPacket, Pool, RowDataPacket } from 'mysql2/promise'

import { createModel } from './model'
import { ConnectionOptions, ModelKeys } from './types'
import { mapKey } from './utils'
import { createView } from './view'

export class Schema {
  public name: string
  public connection: Pool
  private queries: string[] = []
  constructor(name: string, { create, ...connection }: ConnectionOptions) {
    this.name = name
    this.connection = createPool({
      ...connection,
      multipleStatements: true,
    })

    if (create) {
      this.connection
        .query(`CREATE DATABASE IF NOT EXISTS \`${name}\`; USE \`${name}\`;`)
        .then(() => {
          if (this.queries.length) {
            this.connection.query(this.queries.join(';'))
          }
        })
        .catch((error: any) => {
          this.connection.end()
          console.error({ error })
        })
    }
  }

  createModel<T>(name: string, keys: ModelKeys<T>) {
    const Keys = Object.keys(keys)
    const primaries = Keys.filter((k) => keys[k].primaryKey).map((k) => `\`${k}\``)
    this.queries.push(
      `CREATE TABLE IF NOT EXISTS \`${name}\` (${Keys.map((key) => mapKey(key, keys[key])).join(
        ', '
      )}${primaries.length ? `, PRIMARY KEY (${primaries.join(', ')})` : ''})`
    )
    return createModel<T>(name, keys, this.connection, this.name)
  }

  createView<T>(name: string, keys: string[], query: string) {
    this.queries.push(`CREATE OR REPLACE VIEW \`${name}\` AS ${query}`)
    return createView<T>(name, keys, this.connection, this.name)
  }

  query = <T extends RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]>(sql: string) =>
    this.connection.query<T>(sql)

  close() {
    this.connection.end()
  }
}
