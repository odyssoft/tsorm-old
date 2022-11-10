import { KeyOf, OperatorType, Or, SelectOptions, Where } from './'

export type Alias<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export type OnJoin<T> = Or<JoinOptions<T>> | JoinOptions<T>

export type AliasModel<T> = {
  [key: string]: any
  join: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    join: Join,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  select: (query?: SelectOptions<T>) => Promise<T[]>
  SQL: () => SQLAliasModel<T>

  crossJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  innerJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  leftJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  leftOuterJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  rightJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>

  rightOuterJoin: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    on: OnJoin<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>
}

export type Join = 'CROSS' | 'INNER' | 'LEFT' | 'RIGHT' | 'LEFT OUTER' | 'RIGHT OUTER'
export type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type SQLAliasModel<T> = {
  select: (query?: SelectOptions<T>) => string
}
