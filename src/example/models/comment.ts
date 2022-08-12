import MySchema from '../schema'
import createModel from '../../model'

export interface IComment {
  commentId?: string
  userId: string
  postId: string
  comment: string
}

const comment = createModel<IComment>('comment', {
  commentId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  userId: {
    required: true,
    type: 'INT',
  },
  postId: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
  comment: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})

const Comment = MySchema.addModel<IComment>(comment)

export default Comment
