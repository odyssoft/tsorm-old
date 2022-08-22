import { Pool, PoolOptions } from 'mysql2/promise'
import { ModelType } from './model'

export interface ConnectionOptions extends PoolOptions {
  host: string
  password: string
  port: number
  user: string
}

type Models<T> = {
  [K in keyof T]?: ModelType<T[K]>
}

export type SchemaType<T> = {
  connection: Pool
  models: Models<T>
  name: string

  addModel: <T>(model: ModelType<T>) => ModelType<T>
  close: () => void
}
