import { AliasModelType } from 'types'
import Comment, { IComment } from './models/comment'
import Post, { IPost } from './models/post'
import User, { IUser } from './models/user'

User.as<'u'>('u').select({})
