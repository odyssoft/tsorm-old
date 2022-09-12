import { mockSchema } from '../'

export interface IPost {
  postId?: number
  userId: number
  post: string
}

export const Post = mockSchema.addModel<IPost>('post', {
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
