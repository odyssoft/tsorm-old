import { IComment } from 'example/models/comment'
import { IPost } from 'example/models/post'
import { IUser } from 'example/models/user'
import { KeyOf, OperatorType, Or } from './'

type WhereOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type Where<T, A = any> = Or<WhereOptions<T>> | WhereOptions<T>

const test: Where<IUser & IPost & IComment> = {}
