import { FieldPacket, RowDataPacket } from 'mysql2'

import { Alias, AliasModel } from './aliasModel'
import { SelectOptions } from './model'

export type ViewType<T> = {
  select: (query?: SelectOptions<T>) => Promise<[RowDataPacket[], FieldPacket[]]>

  SQL: () => SQLViewType<T>

  as: <A extends string>(alias: A) => AliasModel<Alias<T, A>>
}

export type SQLViewType<T> = {
  select: (query?: SelectOptions<T>) => string
}
