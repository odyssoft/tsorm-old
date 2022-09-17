import { ConnectionOptions, Schema } from '../'

const options: ConnectionOptions = {
  host: 'localhost',
  password: 'password',
  port: 3306,
  user: 'root',
}

export const mockSchema = new Schema('mock', options)
