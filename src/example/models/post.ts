import MySchema from 'example/schema'
import createModel from 'model'

export interface IPost {
  id?: string
  userId: string
  post: string
}

const post = createModel<IPost>('post', {
  id: {
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

const Post = MySchema.addModel<IPost>(post)

export default Post
