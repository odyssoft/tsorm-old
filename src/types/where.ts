import { KeyOf, OperatorType, Or } from './'

type WhereOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
