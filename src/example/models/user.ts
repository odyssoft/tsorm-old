import MySchema from 'example/schema'
import createModel from 'model'

export interface IUser {
  id?: string
  forename: string
  surname: string
  email: string
  password: string
  birthday: Date
}

const user = createModel<IUser>('user', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  forename: {
    length: 255,
    required: true,
    type: 'VARCHAR',
  },
  surname: {
    length: 255,
    required: true,
    type: 'VARCHAR',
  },
  email: {
    length: 320,
    required: true,
    type: 'VARCHAR',
  },
  password: {
    length: 255,
    required: true,
    type: 'VARCHAR',
  },
  birthday: {
    required: true,
    type: 'DATE',
  },
})

const User = MySchema.addModel<IUser>(user)

const test = new User({})

// const test = new User({
//   forename: 'John',
//   surname: 'Doe',
//   email: 'test@test.com',
//   password: 'asdamsdoi',
//   birthday: new Date(),
// })

export default User
