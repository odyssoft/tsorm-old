import { Schema } from '../'
import { IUser } from './models/user'

interface IMySchema {
  user: IUser
}

const MySchema = Schema<IMySchema>('my_schema', {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
})

export default MySchema
