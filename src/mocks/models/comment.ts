import { model } from '../../'

export interface IMockComment {
  commentId?: number
  userId: number
  postId: number
  comment: string
}

const mockComment = model<IMockComment>('comment', {
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

export default mockComment
