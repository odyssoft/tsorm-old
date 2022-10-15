import { Pool, PoolOptions } from 'mysql2/promise'

import { KeyOf, ModelKeys } from './'

export interface ConnectionOptions extends PoolOptions {
  host: string
  password: string
  port: number
  user: string
}

export type ModelsKeys<T> = {
  [K in keyof T]: ModelKeys<T[K]>
}

export type SchemaType<T> = {
  connection: Pool
  name: string

  close: () => void
}

export type BetweenType<T = any> = {
  min: KeyOf<T> | number
  max: KeyOf<T> | number
}
export type EqualsType<T = any> = KeyOf<T> | number
export type GreaterThanType<T = any> = KeyOf<T> | number
export type GreaterThanEqualType<T = any> = KeyOf<T> | number
export type InType = (string | number)[]
export type LessThanType<T = any> = KeyOf<T> | number
export type LessThanEqualType<T = any> = KeyOf<T> | number
export type LikeType = string

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

export type Or<T> = {
  $or: [T, T, ...T[]]
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
