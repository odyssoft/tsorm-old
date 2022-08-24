import MySchema from 'example/schema'
import { model } from '../../'

export interface IComment {
  commentId?: number
  userId: number
  postId: number
  comment: string
}

const comment = model<IComment>('comment', {
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
    type: 'INT',
  },
  comment: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})

const Comment = MySchema.addModel(comment)

export default Comment
