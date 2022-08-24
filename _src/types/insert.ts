import { Where } from './'

export type InsertOptions<T> = Where<T>

export type Insert<T> = (data: T | T[]) => void
