import {
  BetweenType,
  EqualsType,
  GreaterThanEqualType,
  GreaterThanType,
  InType,
  LessThanEqualType,
  LessThanType,
  LikeType,
  ModelKeys,
} from './types'

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

export const formatValue = (
  input: boolean | number | string | null | undefined,
  keys?: string[]
): number | string => {
  if (['null', 'undefined'].includes(typeof input)) {
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

export default operator
