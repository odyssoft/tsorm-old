import { model } from '../../'

export interface IMockUser {
  userId?: number
  name: string
  age: number
}

const mockUser = model<IMockUser>('user', {
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

export default mockUser
