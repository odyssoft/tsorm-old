import { KeyOf, OperatorType, Or } from './'

type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type Join<T> = Or<JoinOptions<T>> | JoinOptions<T>
