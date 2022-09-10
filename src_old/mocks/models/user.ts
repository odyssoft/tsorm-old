import { createModel } from '../../'

export interface IMockUser {
  userId?: number
  name: string
  age: number
}

export const mockUser = createModel<IMockUser>('user', {
  userId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  name: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
  age: {
    required: true,
    type: 'INT',
  },
})
