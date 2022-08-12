import { Where } from './types'

const buildWhere = <T>(options: Where<T>): string => {
  let output = ''

  Object.keys(options).forEach((key) => {
    if (options[key] === null) {
    }
  })

  return output
}
