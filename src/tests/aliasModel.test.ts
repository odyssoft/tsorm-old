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
      expect(join.joins).toEqual(['INNER JOIN `mock`.`post` AS p ON u.userId = p.userId'])
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId`
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
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10`
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
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId GROUP BY u.userId`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId GROUP BY u.userId, p.postId`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId ORDER BY u.userId, p.postId DESC`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId ORDER BY p.postId ASC`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId LIMIT 10`
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
        `SELECT * FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId LIMIT 1, 2`
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
        `SELECT u.userId, u.username, u.email, p.postId, p.userId, p.post FROM \`mock\`.\`user\` AS u INNER JOIN \`mock\`.\`post\` AS p ON u.userId = p.userId WHERE u.userId = 1 AND p.postId BETWEEN 1 AND 10 GROUP BY u.userId, p.postId ORDER BY u.userId, p.postId LIMIT 10`
      )
    })

    describe('crossJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const crossJoin = User.as('u').crossJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(crossJoin.alias).toBe('u')
        expect(crossJoin.joins).toEqual(['CROSS JOIN `mock`.`post` AS p ON u.userId = p.userId'])
        expect(crossJoin.keys).toEqual([
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

    describe('innerJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const innerJoin = User.as('u').innerJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(innerJoin.alias).toBe('u')
        expect(innerJoin.joins).toEqual(['INNER JOIN `mock`.`post` AS p ON u.userId = p.userId'])
        expect(innerJoin.keys).toEqual([
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

    describe('leftJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const leftJoin = User.as('u').leftJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(leftJoin.alias).toBe('u')
        expect(leftJoin.joins).toEqual(['LEFT JOIN `mock`.`post` AS p ON u.userId = p.userId'])
        expect(leftJoin.keys).toEqual([
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

    describe('leftOuterJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const leftOuterJoin = User.as('u').leftOuterJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(leftOuterJoin.alias).toBe('u')
        expect(leftOuterJoin.joins).toEqual([
          'LEFT OUTER JOIN `mock`.`post` AS p ON u.userId = p.userId',
        ])
        expect(leftOuterJoin.keys).toEqual([
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

    describe('rightJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const rightJoin = User.as('u').rightJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(rightJoin.alias).toBe('u')
        expect(rightJoin.joins).toEqual(['RIGHT JOIN `mock`.`post` AS p ON u.userId = p.userId'])
        expect(rightJoin.keys).toEqual([
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

    describe('rightOuterJoin', () => {
      it('should return correct join sql with correct combined keys', () => {
        const rightOuterJoin = User.as('u').rightOuterJoin(Post.as('p'), { 'u.userId': 'p.userId' })

        expect(rightOuterJoin.alias).toBe('u')
        expect(rightOuterJoin.joins).toEqual([
          'RIGHT OUTER JOIN `mock`.`post` AS p ON u.userId = p.userId',
        ])
        expect(rightOuterJoin.keys).toEqual([
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
