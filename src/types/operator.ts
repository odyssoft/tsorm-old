import { KeyOf } from './'

type BetweenType<T = any> = {
  min: KeyOf<T> | number
  max: KeyOf<T> | number
}
type EqualsType<T = any> = KeyOf<T> | number
type GreaterThanType<T = any> = KeyOf<T> | number
type GreaterThanEqualType<T = any> = KeyOf<T> | number
type InType = (string | number)[]
type LessThanType<T = any> = KeyOf<T> | number
type LessThanEqualType<T = any> = KeyOf<T> | number
type LikeType = string

interface Between<T> {
  [key: string]: any
  $between: BetweenType<T>
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface Equals<T> {
  [key: string]: any
  $between?: never
  $equals: EqualsType<T>
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface GreaterThan<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan: GreaterThanType<T>
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface GreaterThanEqual<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual: GreaterThanEqualType<T>
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface In {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in: InType
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface LessThan<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan: LessThanType<T>
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface LessThanEqual<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual: LessThanEqualType<T>
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface Like {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like: LikeType
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface NotBetween<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween: BetweenType<T>
  $notEqual?: never
  $notIn?: never
  $notLike?: never
}
interface NotEqual<T> {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual: EqualsType<T>
  $notIn?: never
  $notLike?: never
}
interface NotIn {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn: InType
  $notLike?: never
}
interface NotLike {
  [key: string]: any
  $between?: never
  $equals?: never
  $greaterThan?: never
  $greaterThanEqual?: never
  $in?: never
  $lessThan?: never
  $lessThanEqual?: never
  $like?: never
  $notBetween?: never
  $notEqual?: never
  $notIn?: never
  $notLike: LikeType
}

export type OperatorType<T> =
  | KeyOf<T>
  | Between<T>
  | Equals<T>
  | GreaterThan<T>
  | GreaterThanEqual<T>
  | In
  | LessThan<T>
  | LessThanEqual<T>
  | Like
  | NotBetween<T>
  | NotEqual<T>
  | NotIn
  | NotLike
