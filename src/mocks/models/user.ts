import { mockSchema } from '../'

export interface IUser {
  userId?: number
  username: string
  email: string
  password: string
}

export const User = mockSchema.addModel<IUser>('user', {
  userId: {
    primaryKey: true,
    autoIncrement: true,
    type: 'INT',
  },
  username: {
    type: 'VARCHAR',
    length: 40,
    required: true,
    unique: true,
  },
  email: {
    type: 'VARCHAR',
    length: 310,
    required: true,
    unique: true,
  },
  password: {
    type: 'VARCHAR',
    length: 500,
    required: true,
  },
})
