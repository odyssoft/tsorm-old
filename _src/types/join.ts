import { AliasModelType, BaseModelType, KeyOf, OperatorType, Or } from './'

export type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

// export type Join<T, S = any> =

// export type Join<T> = Or<JoinOptions<T>> | JoinOptions<T>
