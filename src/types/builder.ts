import { FieldPacket, OkPacket, RowDataPacket } from 'mysql2/promise'

import { SelectOptions } from './select'
import { UpdateOptions } from './update'
import { Where } from './where'

export type Builder<T> = {
  [key: string]: any
  delete: (options: Where<T>) => Promise<[OkPacket, FieldPacket[]]>
  insert: (data: T | T[]) => Promise<[OkPacket, FieldPacket[]]>
  select: (options?: SelectOptions<T>) => Promise<[RowDataPacket[], FieldPacket[]]>
  truncate: () => Promise<[OkPacket, FieldPacket[]]>
  update: (data: Partial<T>, options: UpdateOptions<T>) => Promise<[OkPacket, FieldPacket[]]>
  upsert: (data: T | T[]) => Promise<[OkPacket, FieldPacket[]]>
}
