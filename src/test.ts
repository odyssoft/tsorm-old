import { IPost, IUser, Post, User } from './mocks'

const model = User.as('u')

model.join(Post.as('p'), 'INNER', {
  'u.userId': 'p.userId',
})
