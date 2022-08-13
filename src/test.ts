import Comment from './example/models/comment'
import Post from './example/models/post'
import User from './example/models/user'

const table = User.as<'u'>('u')
  .join(Post.as<'p'>('p'), {
    'u.userId': 'p.userId',
  })
  .join(Comment.as<'c'>('c'), {
    'p.postId': 'c.postId',
  })

const sql = table.select({
  $where: {
    'p.postId': 'c.postId',
  },
})

console.log({ sql })
