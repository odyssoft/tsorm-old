import { createSchema } from '../'
import { IMockPost, IMockUser, mockPost, mockUser } from './models'

export interface IMySchema {
  post: IMockPost
  user: IMockUser
}

const MySchema = createSchema<IMySchema>(
  'my_schema',
  {
    host: '',
    port: 1337,
    user: '',
    password: '',
  },
  {
    post: mockPost,
    user: mockUser,
  }
)

export const { post: Post, user: User } = MySchema.models

export default MySchema
