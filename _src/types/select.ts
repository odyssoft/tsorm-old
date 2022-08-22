import { IUser } from 'example/models/user'
import { KeyOf, Where } from './'

export interface SelectOptions<T> {
  $columns?: Column<T>[]
  $where?: Where<T>
}

type Column<T> = KeyOf<T>

export type Select<T> = (options?: SelectOptions<T>) => void
