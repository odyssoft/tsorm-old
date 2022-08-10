import { Where } from './'

export type DeleteOptions<T, A = any> = Where<T, A>

export type Delete<T> = (options?: DeleteOptions<T>) => void
