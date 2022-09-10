import { createModel } from '../../'

export interface IPost {
  postId?: number
  userId: number
  post: string
}

export const post = createModel<IPost>('post', {
  postId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  userId: {
    required: true,
    type: 'INT',
  },
  post: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})
