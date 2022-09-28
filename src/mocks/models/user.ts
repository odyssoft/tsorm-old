import { DataTypes } from '../../datatypes'
import { mockSchema } from '../schema'

export interface IUser {
  userId?: number
  username: string
  email: string
  password: string
}

export const User = mockSchema.createModel<IUser>('user', {
  userId: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.int,
  },
  username: {
    type: DataTypes.varchar(40),
    required: true,
    unique: true,
  },
  email: {
    type: DataTypes.varchar(310),
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.varchar(500),
    required: true,
  },
})
