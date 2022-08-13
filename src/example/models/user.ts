import MySchema from '../schema'
import createModel from '../../model'

export interface IUser {
  userId?: string
  name: string
  age: number
}

const user = createModel<IUser>('user', {
  userId: {
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

export default User
