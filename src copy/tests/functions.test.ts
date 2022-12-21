import { isFunction } from '../functions'

describe('isfunction', () => {
  it('should return true when value starts with MySQL function', () => {
    const result = isFunction('ASCII(something)')
    expect(result).toBe(true)
  })

  it('should return true when value equals MySQL function', () => {
    const result = isFunction('CURRENT_TIMESTAMP')
    expect(result).toBe(true)
  })

  it('should return false when value is not a MySQL function', () => {
    const result = isFunction('something')
    expect(result).toBe(false)
  })
})
