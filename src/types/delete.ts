import { AliasModelKeys, Where } from './'

export type DeleteOptions<T, A = any> = Where<A extends string ? AliasModelKeys<T, A> : T>

export type Delete<T> = (options: DeleteOptions<T>) => void
