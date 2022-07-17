import { PoolOptions } from 'mysql2/promise'
import { ConnectionOptions } from '../../types'
import Schema from '../../schema'

const mockEnd = jest.fn()
let mockPromise = Promise.resolve([])
const mockQuery = jest.fn(() => mockPromise)

const mockCreatePool = jest.fn((options) => ({
  end: mockEnd,
  query: mockQuery,
}))

jest.mock('mysql2/promise', () => ({
  createPool: (options: PoolOptions) => mockCreatePool(options),
}))

const mockConnection: ConnectionOptions = {
  host: 'localhost',
  password: 'password',
  port: 3306,
  user: 'user',
}

describe('Schema', () => {
  it('should call createPool with correct params', (done) => {
    const testSchema = Schema('test', mockConnection)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockConnection)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)
      done()
    }, 250)
  })
  it('should call end when create query fails', (done) => {
    jest.clearAllMocks()
    mockPromise = Promise.reject(new Error('Something went wrong'))
    const testSchema = Schema('test', mockConnection)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockConnection)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)
      expect(mockEnd).toHaveBeenCalled()
      done()
    }, 250)
  })
  it('should call end when user closes schema', (done) => {
    jest.clearAllMocks()
    mockPromise = Promise.resolve([])
    const testSchema = Schema('test', mockConnection)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockConnection)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)

      expect(mockEnd).not.toHaveBeenCalled()
      testSchema.close()
      expect(mockEnd).toHaveBeenCalled()
      done()
    }, 250)
  })
})
