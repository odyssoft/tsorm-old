import { createModel } from '../../'

export interface IComment {
  commentId?: number
  userId: number
  postId: number
  comment: string
}

export const comment = createModel<IComment>('comment', {
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
