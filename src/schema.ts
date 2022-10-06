import { createModel } from './model'
import { createPool, Pool } from 'mysql2/promise'
import { mapKey } from './utils'

import { ConnectionOptions, KeyOf, ModelKeys } from './types'

export class Schema {
  public name: string
  public connection: Pool
  private queries: string[] = []
  constructor(name: string, connection: ConnectionOptions) {
    this.name = name
    this.connection = createPool({
      ...connection,
      multipleStatements: true,
    })
    this.connection
      .query(`CREATE DATABASE IF NOT EXISTS \`${name}\`; USE \`${name}\`;`)
      .then(() => this.connection.query(this.queries.join(';')))
      .catch((error: any) => {
        this.connection.end()
        console.error({ error })
      })
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

  close() {
    this.connection.end()
  }
}
