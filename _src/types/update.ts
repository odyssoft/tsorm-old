import { Where } from './'

export type UpdateOptions<T> = Where<T>

export type Update<T> = (data: Partial<T>, options: UpdateOptions<T>) => void
