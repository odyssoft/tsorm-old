import { AliasModelType, BaseModelType, KeyOf, OperatorType, Or } from './'

type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type Join<T> = <S>(
  model: AliasModelType<S, any>,
  joinOptions: JoinOptions<T & S>
) => BaseModelType<T & S>

// export type Join<T, S = any> =

// export type Join<T> = Or<JoinOptions<T>> | JoinOptions<T>
