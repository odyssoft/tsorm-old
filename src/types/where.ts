import { KeyOf, OperatorType } from './'

export type Where<T, S = any> = {
  [Key in KeyOf<T>]?: KeyOf<S> | number | null | OperatorType<S> | OperatorType<S>[]
}
