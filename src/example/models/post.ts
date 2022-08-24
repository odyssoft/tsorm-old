import MySchema from 'example/schema'
import { model } from '../../'

export interface IPost {
  postId?: number
  userId: number
  post: string
}

const post = model<IPost>('post', {
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

const Post = MySchema.addModel(post)

export default Post
