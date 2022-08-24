import { PoolOptions } from 'mysql2/typings/mysql'
import { IMySchema } from '../mocks/schema'
import { Schema } from '../'
import { ConnectionOptions } from '../types'
import mockUser from '../mocks/models/user'

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

const mockOptions: ConnectionOptions = {
  host: 'localhost',
  password: 'password',
  port: 3306,
  user: 'user',
}

describe('Schema', () => {
  it('should call createPool with correct params', (done) => {
    Schema<IMySchema>('test', mockOptions)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockOptions)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)
      done()
    }, 250)
  })

  it('should call end when create query fails', (done) => {
    mockPromise = Promise.reject(new Error('Something went wrong'))
    Schema<IMySchema>('test', mockOptions)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockOptions)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)
      expect(mockEnd).toHaveBeenCalled()
      done()
    }, 250)
  })

  it('should call end when user closes schema', (done) => {
    jest.clearAllMocks()
    mockPromise = Promise.resolve([])
    const testSchema = Schema('test', mockOptions)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith(mockOptions)
      expect(mockQuery).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS test; USE test`)

      expect(mockEnd).not.toHaveBeenCalled()
      testSchema.close()
      expect(mockEnd).toHaveBeenCalled()
      done()
    }, 250)
  })

  it('should add model correctly', () => {
    const testSchema = Schema<IMySchema>('test', mockOptions)
    expect(testSchema.models).toEqual({})
    testSchema.addModel(mockUser)
    expect(testSchema.models).toEqual({ user: mockUser.keys })
  })
})
