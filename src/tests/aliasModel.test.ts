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

import { Post, User } from '../mocks'

describe('aliasModel', () => {
  describe('join()', () => {
    it('should return correct join sql with correct combined keys', () => {
      const join = User.as('u').join(Post.as('p'), 'INNER', {
        'u.userId': 'p.userId',
      })

      expect(join.alias).toBe('u')
      expect(join.joins).toEqual(['INNER JOIN `post` AS p ON u.userId = p.userId'])
      expect(join.keys).toEqual([
        'u.userId',
        'u.username',
        'u.email',
        'u.password',
        'p.postId',
        'p.userId',
        'p.post',
      ])
    })
  })

  describe('select()', () => {
    it('should return correct select script without where clause', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select()
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId`
      )
    })

    it('should return correct select script with specified columns', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $columns: ['u.userId', 'u.username', 'u.email', 'p.postId', 'p.userId', 'p.post'],
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId`
      )
    })

    it('should return correct select script with where clause', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $where: {
            'u.userId': 1,
            'p.postId': {
              $between: {
                min: 1,
                max: 10,
              },
            },
          },
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10`
      )
    })

    it('should return correct select script with where clause and columns', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $columns: ['u.userId', 'u.username', 'u.email', 'p.postId', 'p.userId', 'p.post'],
          $where: {
            'u.userId': 1,
            'p.postId': {
              $between: {
                min: 1,
                max: 10,
              },
            },
          },
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10`
      )
    })

    it('should return correct select script with single group by', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $groupBy: 'u.userId',
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId GROUP BY u.userId`
      )
    })

    it('should return correct select script with multiple group by', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $groupBy: ['u.userId', 'p.postId'],
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId GROUP BY u.userId, p.postId`
      )
    })

    it('should return correct select script with multiple order by', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $orderBy: ['u.userId', 'p.postId DESC'],
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId ORDER BY u.userId, p.postId DESC`
      )
    })

    it('should return correct select script with single order by', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $orderBy: 'p.postId ASC',
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId ORDER BY p.postId ASC`
      )
    })

    it('should return correct select script with limit', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $limit: 10,
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId LIMIT 10`
      )
    })

    it('should return correct select script with limit and skip', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $limit: [1, 2],
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId LIMIT 1, 2`
      )
    })

    it('should return correct script with all options', () => {
      User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .select({
          $columns: ['u.userId', 'u.username', 'u.email', 'p.postId', 'p.userId', 'p.post'],
          $where: {
            'u.userId': 1,
            'p.postId': {
              $between: {
                min: 1,
                max: 10,
              },
            },
          },
          $groupBy: ['u.userId', 'p.postId'],
          $orderBy: ['u.userId', 'p.postId'],
          $limit: 10,
        })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`user\` AS u INNER JOIN \`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10 GROUP BY u.userId, p.postId ORDER BY u.userId, p.postId LIMIT 10`
      )
    })
  })

  describe('SQL', () => {
    it('should have correct properties', () => {
      const sql = User.as('u')
        .join(Post.as('p'), 'INNER', {
          'u.userId': 'p.userId',
        })
        .SQL()
      expect(sql).toHaveProperty('select')
    })
  })
})
