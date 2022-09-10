import { createSchema } from '../'
import { IComment, IPost, IUser, comment, post, user } from './models'

interface ITestSchema {
  comment: IComment
  post: IPost
  user: IUser
}

export const testSchema = createSchema<ITestSchema>(
  'testSchema',
  {
    host: 'localhost',
    port: 3306,
    user: 'YOUR_DATABASE_USER',
    password: 'YOUR_DATABASE_PASSWORD',
  },
  {
    comment,
    post,
    user,
  }
)

export const { comment: Comment, post: Post, user: User } = testSchema.models
