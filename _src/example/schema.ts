import { Schema } from '../'
import { IComment } from './models/comment'
import { IPost } from './models/post'
import { IUser } from './models/user'

interface IMySchema {
  comment: IComment
  post: IPost
  user: IUser
}

type Model<T> = {
  name: string
  fields?: T
}

type Models<T> = {
  [K in keyof T]: Model<T[K]>
}

const Models: Models<IMySchema> = {
  comment: { name: 'comment' },
  post: { name: 'post' },
  user: { name: 'comment' },
}

const MySchema = Schema<IMySchema>('my_schema', {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
})

export default MySchema
