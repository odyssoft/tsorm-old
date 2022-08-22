import { PoolOptions } from 'mysql2/promise'
import { ConnectionOptions } from '../../types'
import Schema, { mapKey } from '../../schema'
import { model } from '../../model'

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
interface MockModelType {
  mockId?: number
  mockName?: string
}
const mockModel = model<MockModelType>('mock', {
  mockId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  mockName: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})

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

  it('should add model correctly', () => {
    const testSchema = Schema<{ mock: MockModelType }>('test', mockConnection)
    expect(testSchema.models).toEqual({})
    testSchema.addModel(mockModel)
    expect(testSchema.models).toEqual({ mock: mockModel.keys })
  })
})

describe('mapKey()', () => {
  it('should return correct string with default as string', () => {
    const result = mapKey('test', {
      type: 'VARCHAR',
      length: 255,
      autoIncrement: true,
      primaryKey: true,
      required: true,
      default: 'test',
    })
    expect(result).toBe("`test` VARCHAR(255) AUTO_INCREMENT PRIMARY KEY NOT NULL DEFAULT 'test'")
  })

  it('should return correct string with default as number', () => {
    const result = mapKey('test', {
      type: 'INT',
      autoIncrement: true,
      primaryKey: true,
      required: true,
      default: 0,
    })
    expect(result).toBe('`test` INT AUTO_INCREMENT PRIMARY KEY NOT NULL DEFAULT 0')
  })
})
