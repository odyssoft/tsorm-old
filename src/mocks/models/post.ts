import { model } from '../../'

export interface IMockPost {
  postId?: number
  userId: number
  post: string
}

const mockPost = model<IMockPost>('post', {
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

export default mockPost
