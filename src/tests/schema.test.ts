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

const mockTableOptions = { id: { type: 'INT' }, otherId: { type: 'INT' } }

describe('Schema', () => {
  describe('Instantiation', () => {
    it('should call createPool with correct params', () => {
      new Schema('test', mockOptions)
      expect(mockCreatePool).toHaveBeenCalledWith({
        ...mockOptions,
        multipleStatements: true,
      })
      expect(mockQuery).not.toHaveBeenCalledWith(
        'CREATE DATABASE IF NOT EXISTS `test`; USE `test`;'
      )
    })

    it('should create schema and tables when specified', (done) => {
      const schema = new Schema('test', { ...mockOptions, create: true })
      schema.createModel('mock', mockTableOptions)
      expect(mockCreatePool).toHaveBeenCalledWith({
        ...mockOptions,
        multipleStatements: true,
      })
      expect(mockQuery).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `test`; USE `test`;')
      setTimeout(() => {
        expect(mockQuery).toHaveBeenCalledWith(
          'CREATE TABLE IF NOT EXISTS `mock` (`id` INT, `otherId` INT)'
        )
        done()
      }, 100)
    })

    it('should create schema and not create tables when no tables exist', (done) => {
      new Schema('test', { ...mockOptions, create: true })
      expect(mockCreatePool).toHaveBeenCalledWith({
        ...mockOptions,
        multipleStatements: true,
      })
      expect(mockQuery).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `test`; USE `test`;')
      setTimeout(() => {
        expect(mockQuery).not.toHaveBeenCalledWith(
          'CREATE TABLE IF NOT EXISTS `mock` (`id` INT, `otherId` INT)'
        )
        done()
      }, 100)
    })

    it('should call end when create query fails', (done) => {
      mockPromise = Promise.reject(new Error('Something went wrong'))
      new Schema('test', { ...mockOptions, create: true })
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
  })

  describe('createModel', () => {
    it('should create table with multiple primary keys when specified', (done) => {
      jest.clearAllMocks()
      mockPromise = Promise.resolve([])
      const testSchema = new Schema('test', { ...mockOptions, create: true })
      testSchema.createModel('mock', {
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
          'CREATE TABLE IF NOT EXISTS `mock` (`id` INT, `otherId` INT, PRIMARY KEY (`id`, `otherId`))'
        )
        done()
      }, 100)
    })
  })

  describe('query', () => {
    it('should call query with passed sql', () => {
      const testSchema = new Schema('test', mockOptions)
      testSchema.query('SELECT * FROM test')
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM test')
    })
  })

  describe('close', () => {
    it('should call connection.end', () => {
      jest.clearAllMocks()
      mockPromise = Promise.resolve([])
      const testSchema = new Schema('test', mockOptions)
      expect(mockCreatePool).toHaveBeenCalledWith({
        ...mockOptions,
        multipleStatements: true,
      })
      testSchema.close()
      expect(mockEnd).toHaveBeenCalled()
    })
  })
})
