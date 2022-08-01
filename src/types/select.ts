import { Join, Where } from './'

export interface SelectOptions<T> {
  $join?: Join<T>
  $where?: Where<T>
}
export type Select<T> = (options: SelectOptions<T>) => void
