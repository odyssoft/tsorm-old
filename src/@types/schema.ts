import { Pool, PoolOptions } from 'mysql2/promise'

export interface ConnectionOptions extends PoolOptions {
  host: string
  password: string
  port: number
  user: string
}

export type SchemaType<T> = {
  connection: Pool
  name: string

  close: () => void
}
