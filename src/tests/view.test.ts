import { PoolOptions } from 'mysql2/promise'

const mockEnd = jest.fn()
let mockResponse: any = {}
const mockQuery = jest.fn((query) => Promise.resolve([mockResponse]))

const mockCreatePool = jest.fn((options) => ({
  end: mockEnd,
  query: mockQuery,
}))

jest.mock('mysql2/promise', () => ({
  createPool: (options: PoolOptions) => mockCreatePool(options),
}))

import { UserPost } from '../mocks'

const mockUser = {
  email: 'test@test.com',
  password: 'password',
  username: 'testUser',
}

describe('view', () => {
  describe('as', () => {
    it('should return an alias model', () => {
      const alias = UserPost.as('u')
      expect(alias.alias).toBe('u')
      expect(alias.keys).toEqual(['u.postId', 'u.userId', 'u.post', 'u.username', 'u.email'])
    })
  })

  describe('select', () => {
    it('should call query with correct params and return results with $columns & $with', async () => {
      mockResponse = [{ userId: 1, username: 'test' }]
      const users = await UserPost.select({
        $columns: ['userId', 'username'],
        $where: { userId: { $greaterThanEqual: 1 } },
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT userId, username FROM \`mock\`.\`userpost\` WHERE userId >= 1`
      )
      expect(users).toEqual([[{ userId: 1, username: 'test' }]])
    })

    it('should call query with correct params and return results with $with', async () => {
      mockResponse = [{ ...mockUser, userId: 1 }]
      const users = await UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1`
      )
      expect(users).toEqual([[{ ...mockUser, userId: 1 }]])
    })

    it('should call query with correct params and return results without $with', async () => {
      mockResponse = [{ ...mockUser, userId: 1 }]
      const users = await UserPost.select()
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`mock\`.\`userpost\``)
      expect(users).toEqual([[{ ...mockUser, userId: 1 }]])
    })

    it('should call query with correct query using single group by', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $groupBy: 'userId',
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 GROUP BY userId`
      )
    })

    it('should call query with correct query using multiple group by', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $groupBy: ['userId', 'email'],
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 GROUP BY userId, email`
      )
    })

    it('should call query with correct query using single order by', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $orderBy: 'userId',
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 ORDER BY userId`
      )
    })

    it('should call query with correct query using multiple order by', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $orderBy: ['userId ASC', 'email DESC'],
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 ORDER BY userId ASC, email DESC`
      )
    })

    it('should call query with correct query using limit', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $limit: 10,
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 LIMIT 10`
      )
    })

    it('should call query with correct query using limit and skip', () => {
      UserPost.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $limit: [1, 2],
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`mock\`.\`userpost\` WHERE userId >= 1 LIMIT 1, 2`
      )
    })
  })

  describe('SQL', () => {
    it('should have correct properties', () => {
      const sql = UserPost.SQL()
      expect(sql).toHaveProperty('select')
    })

    it('should return correct SQL for select', () => {
      const sql = UserPost.SQL().select({
        $columns: ['userId', 'username'],
        $where: { userId: { $greaterThanEqual: 1 } },
      })
      expect(sql).toBe(`SELECT userId, username FROM \`mock\`.\`userpost\` WHERE userId >= 1`)
    })
  })
})
