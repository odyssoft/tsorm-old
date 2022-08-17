import { KeyOf, OperatorType, Or } from './'

interface StringOverride extends String {}

type WhereOptions<T> = {
  [Key in KeyOf<T>]?: boolean | number | null | OperatorType<T> | OperatorType<T>[] | StringOverride
}

export type Where<T> = Or<WhereOptions<T>> | WhereOptions<T>
