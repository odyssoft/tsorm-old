import { FieldPacket, RowDataPacket } from 'mysql2'

import { Alias, AliasModel } from './aliasModel'
import { SelectOptions } from './query'

export type ViewType<T, N extends string = any> = {
  select: (query?: SelectOptions<T>) => Promise<[RowDataPacket[], FieldPacket[]]>

  SQL: () => SQLViewType<T>

  as: <A extends string>(alias: A) => AliasModel<Alias<T, A>>
}

export type SQLViewType<T> = {
  select: (query?: SelectOptions<T>) => string
}
