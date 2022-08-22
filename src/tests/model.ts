import { model } from '../'
import mockUser from '../mocks/models/user'

describe('model', () => {
  describe('as()', () => {
    it('should return correct aliased model', () => {
      expect(mockUser.alias).toBeUndefined()
      const alias = mockUser.as<'u'>('u')
      expect(alias.alias).toBe('u')
    })
  })

  describe('delete()', () => {})
  describe('insert()', () => {})
  describe('select()', () => {})
  describe('truncate()', () => {})
  describe('update()', () => {})
  describe('upsert()', () => {})
})
