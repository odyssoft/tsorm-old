import { DataTypes } from '../../datatypes'
import { mockSchema } from '../schema'

export interface IPost {
  postId?: number
  userId: number
  post: string
}

export const Post = mockSchema.createModel<IPost>('post', {
  postId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: DataTypes.int,
  },
  userId: {
    required: true,
    type: DataTypes.int,
  },
  post: {
    required: true,
    type: DataTypes.varchar(255),
  },
})
