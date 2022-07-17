import createModel from 'model'
import { Pool, PoolOptions } from 'mysql2/promise'
import { ModelKeys, ModelType } from './model'

export interface ConnectionOptions extends PoolOptions {
  host: string
  password: string
  port: number
  user: string
}

export type KeyOf<T> = keyof T

type Models<T> = {
  [K in KeyOf<T>]?: ModelKeys<T[K]>
}

export type SchemaType<T> = {
  connection: Pool
  models: Models<T>
  name: string

  addModel: <T>(model: ModelType<T>) => typeof model.model
  // addModel: <T>(key: keyof T, model: ModelType<T>) => typeof model.model
  close: () => void
}
