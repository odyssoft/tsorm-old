import { Schema } from '../'

interface IMySchema {}

const MySchema = Schema<IMySchema>('my_schema', {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
})

export default MySchema
