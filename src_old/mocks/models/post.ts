import { createModel } from '../../'

export interface IMockPost {
  postId?: number
  userId: number
  post: string
}

export const mockPost = createModel<IMockPost>('post', {
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
