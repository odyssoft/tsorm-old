import { IComment } from 'example/models/comment'
import { IPost } from 'example/models/post'
import { IUser } from 'example/models/user'
import { KeyOf, OperatorType, Or } from './'

type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type Join<T> = Or<JoinOptions<T>> | JoinOptions<T>

type TestType<T> = {
  [K in KeyOf<T>]?: KeyOf<T>
}

const test: TestType<IUser & IComment> = {
  age: 
}
