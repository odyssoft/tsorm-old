import { KeyOf, OperatorType, Or } from './'

type WhereOptions<T, S = any> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<S> | OperatorType<S>[]
}

export type Where<T, S = any> = Or<WhereOptions<T, S>> | WhereOptions<T, S>
