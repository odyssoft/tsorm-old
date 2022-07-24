import { IUser } from 'example/models/user'
import { AliasModelType, ModelKeys, ModelType, Where } from './types'

function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    name,
    keys,
    as<A extends string>(alias: string): AliasModelType<T, A> {
      return <AliasModelType<T, A>>(<any>this)
    },
    delete(options: Where<T>) {},
    insert(data: T | T[]) {},
    select() {},
    update(data: T | T[]) {},
  }
}

export default model

const user = model<IUser>('user', {
  userId: {
    type: 'INT',
    primaryKey: true,
    autoIncrement: true,
  },
  age: {
    type: 'INT',
  },
  name: {
    type: 'VARCHAR',
    length: 255,
  },
})

const alias = user.as<'u'>('u')
alias.keys['u.age']
alias.