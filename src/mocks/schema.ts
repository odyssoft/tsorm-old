import { Schema } from '../'
import { IMockComment } from './models/comment'
import { IMockPost } from './models/post'
import { IMockUser } from './models/user'

export interface IMySchema {
  comment: IMockComment
  post: IMockPost
  user: IMockUser
}

const MySchema = Schema<IMySchema>('my_schema', {
  host: '',
  port: 1337,
  user: '',
  password: '',
})

export default MySchema
