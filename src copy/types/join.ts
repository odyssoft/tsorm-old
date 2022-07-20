import Post, { IPost } from 'example/models/post'
import { IUser } from 'example/models/user'
import { KeyOf, AliasModelType, OperatorType, Or } from './'

export type Join<T, S> = {
  model: AliasModelType<S>
  on: On<T, S> | Or<On<T, S>> | On<S, T> | Or<On<S, T>>
}

export type On<T, S = any, Alias = ''> = {
  [key in KeyOf<T>]?: number | null | OperatorType<S> | OperatorType<S>[]
}

type JoinOptions<T, S> = {

}

function join(options: JoinOptions ) {

}

const testJoin: Join<IUser, IPost> = {
  model<'p'>: Post.as('p'),
  on: {
    $or: [
      {
        id: 'userId',
      },
      {
        id,
      },
    ],
  },
}
