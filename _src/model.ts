import { builder } from './builder'
import {
  AliasModelKeys,
  AliasModelType,
  JoinOptions,
  ModelKeys,
  ModelType,
  SelectOptions,
  UpdateOptions,
  Where,
} from './types'

export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    joins: [],
    keys,
    name,
    as<A extends string>(alias: string): AliasModelType<T, A> {
      this.alias = alias
      return <AliasModelType<T, A>>(<any>{
        ...this,
        join<S, AA extends string>(
          model: AliasModelType<S, AA>,
          options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
        ) {
          return join<AliasModelType<T, A>, AliasModelKeys<T, A>, S, AA>(
            <ModelType<AliasModelType<T, A>>>(<any>this),
            model,
            options
          )
        },
      })
    },

    delete(options: Where<T>) {
      return builder<T>(this).delete(options)
    },
    insert(data: T | T[]) {
      return builder<T>(this).insert(data)
    },
    select(options?: SelectOptions<T>) {
      return builder<T>(this).select(options)
    },
    truncate() {
      return builder<T>(this).truncate()
    },
    update(data: Partial<T>, options: UpdateOptions<T>) {
      return builder<T>(this).update(data, options)
    },
    upsert(data: Partial<T> | Partial<T>[], options: UpdateOptions<T>) {},
  }
}

function join<T, K, S, A extends string>(
  original: ModelType<T>,
  model: AliasModelType<S, A>,
  options: JoinOptions<K & AliasModelKeys<S, A>>
): ModelType<K & AliasModelKeys<S, A>> {
  original.joins.push({ model, options })
  return <ModelType<K & AliasModelKeys<S, A>>>(<any>original)
}

export default model
