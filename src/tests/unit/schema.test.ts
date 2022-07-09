import { ConnectionOptions } from '../../@types'
import Schema from '../../schema'

const mockEnd = jest.fn()
let mockPromise = Promise.resolve([])
const mockQuery = jest.fn(() => mockPromise)

const mockCreatePool = jest.fn(() => ({
  end: mockEnd,
  query: mockQuery,
}))

jest.mock('mysql/promise', () => ({
  createPool: mockCreatePool,
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
  // it('should call end when create query fails', () => {})
  // it('should call end when user closes schema', () => {})
})
