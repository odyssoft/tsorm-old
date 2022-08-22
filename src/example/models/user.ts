import MySchema from '../schema'
import { model } from '../../'

export interface IUser {
  userId?: string
  name: string
  age: number
}

const user = model<IUser>('user', {
  userId: {
    type: 'INT',
    autoIncrement: true,
    primaryKey: true,
    required: true,
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
