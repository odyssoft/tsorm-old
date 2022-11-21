import { Post } from '../models/post'
import { User } from '../models/user'
import { mockSchema } from '../schema'

export interface IUserPost {
  postId: number
  userId: number
  post: string
  username: string
  email: string
}

export const UserPost = mockSchema.createView<IUserPost>(
  'userpost',
  {},
  User.as('u').innerJoin(Post.as('p'), {
    'u.userId': 'p.userId',
  })
)
