import Comment from './example/models/comment'

const sql = Comment.delete({
  id: {
    $in: [1, 2, 3, 4],
  },
})

console.log({ sql })
