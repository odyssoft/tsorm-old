import { ConnectionOptions, Schema } from '../'

const options: ConnectionOptions = {
  host: 'localhost',
  password: '!TestPassword123',
  port: 3306,
  user: 'tsorm',
}

export const mockSchema = new Schema('mock', options)
