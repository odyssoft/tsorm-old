import { createSchema, SchemaType } from '../'
import { IUser, UserKeys } from './models'

interface TestSchema {
  user: IUser
}

const testSchema = createSchema<TestSchema>(
  'test',
  {
    host: 'localhost',
    password: 'password',
    port: 3306,
    user: 'root',
  },
  {
    user: UserKeys,
  }
)

export const { user: User } = testSchema.models
