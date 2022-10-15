import { PoolOptions } from 'mysql2/typings/mysql'
import { Schema } from '../'
import { ConnectionOptions } from '../types'

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
  it('should call createPool with correct params', () => {
    new Schema('test', mockOptions)
    expect(mockCreatePool).toHaveBeenCalledWith({
      ...mockOptions,
      multipleStatements: true,
    })
    expect(mockQuery).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `test`; USE `test`;')
  })

  it('should call end when create query fails', (done) => {
    mockPromise = Promise.reject(new Error('Something went wrong'))
    new Schema('test', mockOptions)
    setTimeout(() => {
      expect(mockCreatePool).toHaveBeenCalledWith({
        ...mockOptions,
        multipleStatements: true,
      })
      expect(mockQuery).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `test`; USE `test`;')
      expect(mockEnd).toHaveBeenCalled()
      done()
    }, 250)
  })

  it('should call end when user closes schema', () => {
    jest.clearAllMocks()
    mockPromise = Promise.resolve([])
    const testSchema = new Schema('test', mockOptions)
    expect(mockCreatePool).toHaveBeenCalledWith({
      ...mockOptions,
      multipleStatements: true,
    })
    expect(mockQuery).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `test`; USE `test`;')
    testSchema.close()
    expect(mockEnd).toHaveBeenCalled()
  })

  it('should create table with no primary keys when no primary key specified', (done) => {
    const testSchema = new Schema('test', mockOptions)
    testSchema.createModel('test', {
      id: {
        type: 'INT',
      },
      otherId: {
        type: 'INT',
      },
    })
    setTimeout(() => {
      expect(mockQuery).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS `test` (`id` INT, `otherId` INT)'
      )
      done()
    }, 100)
  })

  it('should create table with multiple primary keys when specified', (done) => {
    const testSchema = new Schema('test', mockOptions)
    testSchema.createModel('test', {
      id: {
        type: 'INT',
        primaryKey: true,
      },
      otherId: {
        type: 'INT',
        primaryKey: true,
      },
    })
    setTimeout(() => {
      expect(mockQuery).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS `test` (`id` INT, `otherId` INT, PRIMARY KEY (`id`, `otherId`))'
      )
      done()
    }, 100)
  })

  it('should call query with passed sql', () => {
    const testSchema = new Schema('test', mockOptions)
    testSchema.query('SELECT * FROM test')
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM test')
  })
})
