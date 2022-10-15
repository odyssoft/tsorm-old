import { KeyOf, OperatorType, SelectOptions } from './'

export type Alias<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export type AliasModel<T> = {
  [key: string]: any
  join: <S, A extends string>(
    alias: AliasModel<Alias<S, A>>,
    join: Join,
    on: JoinOptions<T & Alias<S, A>>
  ) => AliasModel<T & Alias<S, A>>
  select: (query?: SelectOptions<T>) => Promise<T[]>
  SQL: () => SQLAliasModel<T>
}

export type Join = 'CROSS' | 'INNER' | 'LEFT' | 'RIGHT' | 'LEFT OUTER' | 'RIGHT OUTER'
export type JoinOptions<T> = {
  [Key in KeyOf<T>]?: number | null | OperatorType<T> | OperatorType<T>[]
}

export type SQLAliasModel<T> = {
  select: (query?: SelectOptions<T>) => string
}
