import { ColumnOptions } from './types'

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
