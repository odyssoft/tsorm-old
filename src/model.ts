import { ModelKeys, ModelType } from './@types/model'

function createModel<T>(name: string, keys: ModelKeys<T>) {
  return Model<T>
}

interface IUser {
  name: string
  password: string
  age: number
}

const User = createModel<IUser>('user', {
  name: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  password: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  age: {
    type: 'INT',
    required: true,
  },
})

const user = new User({ name: 'test', password: 'test', age: 1 })
// user.

class Model<T> implements ModelType<T> {
  properties: Partial<T>
  constructor(object: T) {
    this.properties = object
  }

  save() {}
}

user

export default Model
