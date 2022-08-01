import { Where } from './'

export type DeleteOptions<T> = Where<T>

export type Delete<T> = (options: DeleteOptions<T>) => void
