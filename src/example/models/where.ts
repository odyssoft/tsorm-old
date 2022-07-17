import { Where } from '../../types'
import Post, { IPost } from './post'
import { IUser } from './user'

const where: Where<IUser, IPost> = {
  id: {
    $between: {
      max: 10,
      min: 1,
    },
  },
}

Post.find({})
