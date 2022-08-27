import { createModel } from '../../'

export interface IUser {
  userId?: string
  name: string
  age: number
}

export const user = createModel<IUser>('user', {
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
