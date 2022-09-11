import { createModel, ModelKeys } from '../../'
import { testSchema } from '../schema'

export interface IUser {
  userId?: number
  username: string
  forename: string
  surname: string
  email: string
  password?: string
}

export const UserKeys: ModelKeys<IUser> = {
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
  forename: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  surname: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  password: {
    type: 'VARCHAR',
    length: 500,
    required: true,
  },
}

const User: typeof createModel<IUser>() = testSchema.addModel<IUser>('user', UserKeys)

const test = User