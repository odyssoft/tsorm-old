import { OkPacket, Pool, PoolOptions, RowDataPacket } from 'mysql2/promise'
import { ModelKeys, ModelType } from './model'

export interface ConnectionOptions extends PoolOptions {
  host: string
  password: string
  port: number
  user: string
  create?: boolean
}

export type SchemaType<T> = {
  connection: Pool
  name: T

  close: () => void

  createModel: <M, N>(name: N, keys: ModelKeys<M>) => ModelType<M>
  createView: <V, N>(name: N, keys: string[], query: string) => ViewType<V>

  query: <T extends RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]>(
    sql: string
  ) => Promise<T>
}
