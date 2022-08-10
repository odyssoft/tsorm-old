import {
  AliasModelKeys,
  AliasModelType,
  DeleteOptions,
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

    delete(options: DeleteOptions<T>) {},
    insert(data: T | T[]) {},
    select(options?: SelectOptions<T>) {},
    update(data: T | T[], options: UpdateOptions<T>) {},
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
