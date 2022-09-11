import { ConnectionOptions, Schema, SchemaType } from '../'
import { IUser, UserKeys } from './models'

interface TestSchema {
  user: IUser
}

const options: ConnectionOptions = {
  host: 'localhost',
  password: 'password',
  port: 3306,
  user: 'root',
}

export const testSchema = new Schema<TestSchema>('test', options)

// const testSchema = createSchema<TestSchema>(
//   'test',
//   {
//     host: 'localhost',
//     password: 'password',
//     port: 3306,
//     user: 'root',
//   },
//   {
//     user: UserKeys,
//   }
// )

// export const { user: User } = testSchema.models
