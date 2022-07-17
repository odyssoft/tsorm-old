import MySchema from 'example/schema'
import createModel from 'model'

export interface IUser {
  id?: string
  name: string
  age: number
}

const user = createModel<IUser>('user', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  age: {
    required: true,
    type: 'INT',
  },
  name: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})

const User = MySchema.addModel<IUser>(user)

declare class ModelClass<T> {
  constructor(data: T)
  id: string
  data: T
  save(): Promise<void>
  delete(): Promise<void>
}

const test = new User({
  ModelClass,
})

// const test = new User({
//   forename: 'John',
//   surname: 'Doe',
//   email: 'test@test.com',
//   password: 'asdamsdoi',
//   birthday: new Date(),
// })

export default User
