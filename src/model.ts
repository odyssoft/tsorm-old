import { AliasModelType, ModelKeys, ModelType, Where } from './types'

export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    name,
    keys,
    as<A extends string>(alias: string): AliasModelType<T, A> {
      this.alias = alias
      return <AliasModelType<T, A>>(<any>this)
    },
    delete(options: Where<T>) {},
    insert(data: T | T[]) {},
    select() {},
    update(data: T | T[]) {},
  }
}

export default model
