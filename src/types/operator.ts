import { KeyOf } from './'

export type BetweenType<T = any> = [T, T]
export type EqualsType<T = any> = KeyOf<T> | number
export type GreaterThanType<T = any> = KeyOf<T> | number
export type GreaterThanEqualType<T = any> = KeyOf<T> | number
export type InType = (string | number)[]
export type LessThanType<T = any> = KeyOf<T> | number
export type LessThanEqualType<T = any> = KeyOf<T> | number
export type LikeType = string
export type NotNullType = boolean

interface IBase<T> {
  [key: string]: any
  $between?: never | BetweenType<T>
  $equals?: never | EqualsType<T>
  $greaterThan?: never | GreaterThanType<T>
  $greaterThanEqual?: never | GreaterThanEqualType<T>
  $in?: never | InType
  $lessThan?: never | LessThanType<T>
  $lessThanEqual?: never | LessThanEqualType<T>
  $like?: never | LikeType
  $notBetween?: never | BetweenType<T>
  $notEquals?: never | EqualsType<T>
  $notIn?: never | InType
  $notLike?: never | LikeType
  $notNull?: never | NotNullType
}

interface IBetween<T> extends IBase<T> {
  $between: BetweenType<T>
}

interface IEquals<T> extends IBase<T> {
  $equals: EqualsType<T>
}

interface IGreaterThan<T> extends IBase<T> {
  $greaterThan: GreaterThanType<T>
}

interface IGreaterThanEqual<T> extends IBase<T> {
  $greaterThanEqual: GreaterThanEqualType<T>
}

interface IIn extends IBase<any> {
  $in: InType
}

interface ILessThan<T> extends IBase<T> {
  $lessThan: LessThanType<T>
}

interface ILessThanEqual<T> extends IBase<T> {
  $lessThanEqual: LessThanEqualType<T>
}

interface ILike extends IBase<any> {
  $like: LikeType
}

interface INotBetween<T> extends IBase<T> {
  $notBetween: BetweenType<T>
}

interface INotEquals<T> extends IBase<T> {
  $notEquals: EqualsType<T>
}

interface INotIn extends IBase<any> {
  $notIn: InType
}

interface INotLike extends IBase<any> {
  $notLike: LikeType
}

interface INotNull extends IBase<any> {
  $notNull: NotNullType
}

export type Or<T> = {
  $or: [T, T, ...T[]]
}

export type Operator<T> =
  | KeyOf<T>
  | IBetween<T>
  | IEquals<T>
  | IGreaterThan<T>
  | IGreaterThanEqual<T>
  | IIn
  | ILessThan<T>
  | ILessThanEqual<T>
  | ILike
  | INotBetween<T>
  | INotEquals<T>
  | INotIn
  | INotLike
  | INotNull
