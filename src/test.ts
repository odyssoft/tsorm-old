import { IPost, IUser, Post, User } from './mocks'

setTimeout(() => {
  User.as('u')
    .join(Post.as('p'), 'LEFT', { 'u.userId': 'p.userId' })
    .select({
      $where: {
        'u.userId': 1,
      },
    })
    .then(console.log)
}, 1000)
