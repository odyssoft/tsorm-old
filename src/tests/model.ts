import mockUser from '../mocks/models/user'

let mockPromise = Promise.resolve([{}])
const mockQuery = jest.fn(() => mockPromise)

const User = {
  ...mockUser,
  connection: {
    query: mockQuery,
  },
}

describe('model', () => {
  describe('as()', () => {
    it('should return correct aliased model', () => {
      expect(mockUser.alias).toBeUndefined()
      const alias = mockUser.as<'u'>('u')
      expect(alias.alias).toBe('u')
    })
  })

  describe('delete()', () => {
    User.delete({ userId: 1 }).
  })
  describe('insert()', () => {})
  describe('select()', () => {})
  describe('truncate()', () => {})
  describe('update()', () => {})
  describe('upsert()', () => {})
})
