import {
  BetweenType,
  ColumnOptions,
  EqualsType,
  GreaterThanEqualType,
  GreaterThanType,
  InType,
  LessThanEqualType,
  LessThanType,
  LikeType,
} from './types'

export const formatValue = (
  input: boolean | number | string | null | undefined,
  keys?: string[]
): number | string => {
  if (typeof input === 'undefined' || input === null) {
    return 'NULL'
  }
  if (typeof input === 'number') {
    return input
  }
  if (input === true || input === false) {
    return input ? 1 : 0
  }
  let output: any = `'${input}'`
  if (keys && input && keys.includes(input)) {
    output = input
  }
  return output
}

export const getInsertKeys = <T>(data: T | T[]): string[] => {
  const keys: string[] = []
  Array.isArray(data)
    ? data.forEach((d) => {
        //  @ts-ignore
        Object.keys(d).forEach((key) => {
          if (!keys.includes(key)) {
            keys.push(key)
          }
        })
      })
    : //  @ts-ignore
      keys.push(...Object.keys(data))

  return keys
}

export const getInsertValues = <T>(data: T | T[], keys: string[]): string => {
  const sql: string[] = ['VALUES']
  const rows: any | any[] = data
  if (Array.isArray(rows)) {
    const insert: string[] = []
    rows.forEach((row) => insert.push(`(${keys.map((k) => formatValue(row[k])).join(', ')})`))
    sql.push(insert.join(', '))
  } else {
    sql.push(`(${keys.map((k) => formatValue(rows[k])).join(', ')})`)
  }

  return sql.join(' ')
}

export const mapKey = (key: string, options: ColumnOptions) => {
  const tableKey: string[] = [`\`${key}\``]
  tableKey.push(`${options.type}${options.length ? `(${options.length})` : ''}`)
  options.autoIncrement && tableKey.push('AUTO_INCREMENT')
  options.primaryKey && tableKey.push('PRIMARY KEY')
  options.required && tableKey.push('NOT NULL')
  options.default !== undefined &&
    tableKey.push(
      `DEFAULT ${typeof options.default === 'string' ? `'${options.default}'` : options.default}`
    )
  return tableKey.join(' ')
}

export const operator = <T>(key: string, keys?: string[]) => ({
  $between: ({ max, min }: BetweenType<T>) =>
    `${key} BETWEEN ${formatValue(min, keys)} AND ${formatValue(max, keys)}`,
  $equals: (input: EqualsType<T>) => `${key} = ${formatValue(input, keys)}`,
  $greaterThan: (input: GreaterThanType<T>) => `${key} > ${formatValue(input, keys)}`,
  $greaterThanEqual: (input: GreaterThanEqualType<T>) => `${key} >= ${formatValue(input, keys)}`,
  $in: (input: InType) => `${key} IN (${input.map((i) => formatValue(i)).join(', ')})`,
  $lessThan: (input: LessThanType<T>) => `${key} < ${formatValue(input, keys)}`,
  $lessThanEqual: (input: LessThanEqualType<T>) => `${key} <= ${formatValue(input, keys)}`,
  $like: (input: LikeType) => `${key} LIKE ${formatValue(input)}`,
  $notBetween: ({ max, min }: BetweenType<T>) =>
    `${key} NOT BETWEEN ${formatValue(min)} AND ${formatValue(max)}`,
  $notEquals: (input: EqualsType<T>) => `${key} != ${formatValue(input)}`,
  $notIn: (input: InType) => `${key} NOT IN (${input.map((i) => formatValue(i)).join(', ')})`,
  $notLike: (input: LikeType) => `${key} NOT LIKE ${formatValue(input)}`,
})

export const parseOptions = (options: any, keys?: string[]): string =>
  `${Object.keys(options as any)
    .map((key) =>
      key === '$or'
        ? `(${options[key].map((value: any) => parseOptions(value, keys)).join(' OR ')})`
        : parseValue(key, options[key], keys)
    )
    .join(' AND ')}`

export const parseValue = (key: string, value: any, keys?: string[]): string => {
  if (value === null) {
    return `${key} IS NULL`
  }
  if (typeof value !== 'object') {
    return `${key} = ${formatValue(value, keys)}`
  }
  const Operator: any = operator(key, keys)
  const [id] = Object.keys(value)
  return Operator[id](value[id])
}
