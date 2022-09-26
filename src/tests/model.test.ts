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

const mockUser = {
  email: 'test@test.com',
  password: 'password',
  username: 'testUser',
}
const mockUser2 = {
  email: 'test2@test.com',
  password: 'password2',
  username: 'testUser2',
}

describe('model', () => {
  describe('save', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = { insertId: 1 }
      const user = await new User({ ...mockUser }).save()

      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO `user` (email, password, username) VALUES ('test@test.com', 'password', 'testUser')"
      )

      expect(user.userId).toBe(1)
    })
  })

  describe('as', () => {
    it('should return an alias model', () => {
      const alias = User.as('u')
      expect(alias.alias).toBe('u')
      expect(alias.keys).toEqual(['u.userId', 'u.username', 'u.email', 'u.password'])
    })

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

      it('should return correct select script with where clause', () => {
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
  })

  describe('insert', () => {
    it('should call query with correct params for single insert', async () => {
      await User.insert({ ...mockUser })
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username) VALUES ('test@test.com', 'password', 'testUser')`
      )
    })

    it('should call query with correct params for multiple inserts', async () => {
      await User.insert([{ ...mockUser }, { ...mockUser2 }])

      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username) VALUES ('test@test.com', 'password', 'testUser'), ('test2@test.com', 'password2', 'testUser2')`
      )
    })
  })

  describe('create', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = { insertId: 123 }
      const user = await User.create({ ...mockUser })
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username) VALUES ('test@test.com', 'password', 'testUser')`
      )
      expect(user).toEqual({
        ...mockUser,
        userId: 123,
      })
    })
  })

  describe('createMany', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = { insertId: 123 }
      const users = await User.createMany([{ ...mockUser }, { ...mockUser2 }])
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username) VALUES ('test@test.com', 'password', 'testUser'), ('test2@test.com', 'password2', 'testUser2')`
      )
      expect(users).toEqual([
        {
          ...mockUser,
          userId: 123,
        },
        {
          ...mockUser2,
          userId: 124,
        },
      ])
    })
  })

  describe('delete', () => {
    it('should call query with correct params and return number of affected rows', async () => {
      mockResponse = { affectedRows: 4 }
      const result = await User.delete({ userId: { $greaterThanEqual: 1 } })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1`)
      expect(result).toEqual([{ affectedRows: 4 }])
    })
  })

  describe('deleteBy', () => {
    it('should call query with correct params and return number of affected rows', async () => {
      mockResponse = { affectedRows: 4 }
      const result = await User.deleteBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1`)
      expect(result).toEqual([{ affectedRows: 4 }])
    })
  })

  describe('deleteById', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.deleteById(1)
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId = 1`)
      expect(result).toBe(true)
    })

    it('should call query with correct params and return false when affected rows = 0', async () => {
      mockResponse = { affectedRows: 0 }
      const result = await User.deleteById(1)
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId = 1`)
      expect(result).toBe(false)
    })
  })

  describe('deleteOne', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.deleteOne({ userId: { $greaterThanEqual: 1 } })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(result).toBe(true)
    })

    it('should call query with correct params and return false when affected rows = 0', async () => {
      mockResponse = { affectedRows: 0 }
      const result = await User.deleteOne({ userId: { $greaterThanEqual: 1 } })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(result).toBe(false)
    })
  })

  describe('deleteOneBy', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.deleteOneBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(result).toBe(true)
    })

    it('should call query with correct params and return false when affected rows = 0', async () => {
      mockResponse = { affectedRows: 0 }
      const result = await User.deleteOneBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(result).toBe(false)
    })
  })

  describe('find', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = [mockUser]
      const users = await User.find({ userId: { $greaterThanEqual: 1 } })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1`)
      expect(users).toEqual([mockUser])
    })
  })

  describe('findBy', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = [mockUser]
      const user = await User.findBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1`)
      expect(user).toEqual([mockUser])
    })
  })

  describe('findById', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = [mockUser]
      const user = await User.findById(1)
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId = 1`)
      expect(user).toEqual(mockUser)
    })
  })

  describe('findOne', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = [mockUser]
      const user = await User.findOne({ userId: { $greaterThanEqual: 1 } })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(user).toEqual(mockUser)
    })
  })

  describe('findOneBy', () => {
    it('should call query with correct params and return correct database entry', async () => {
      mockResponse = [mockUser]
      const user = await User.findOneBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1 LIMIT 1`)
      expect(user).toEqual(mockUser)
    })
  })

  describe('select', () => {
    it('should call query with correct params and return results with $columns & $with', async () => {
      mockResponse = [{ userId: 1, username: 'test' }]
      const users = await User.select({
        $columns: ['userId', 'username'],
        $where: { userId: { $greaterThanEqual: 1 } },
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT userId, username FROM \`user\` WHERE userId >= 1`
      )
      expect(users).toEqual([[{ userId: 1, username: 'test' }]])
    })

    it('should call query with correct params and return results with $with', async () => {
      mockResponse = [{ ...mockUser, userId: 1 }]
      const users = await User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
      })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1`)
      expect(users).toEqual([[{ ...mockUser, userId: 1 }]])
    })

    it('should call query with correct params and return results without $with', async () => {
      mockResponse = [{ ...mockUser, userId: 1 }]
      const users = await User.select()
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\``)
      expect(users).toEqual([[{ ...mockUser, userId: 1 }]])
    })

    it('should call query with correct query using single group by', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $groupBy: 'userId',
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` WHERE userId >= 1 GROUP BY userId`
      )
    })

    it('should call query with correct query using multiple group by', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $groupBy: ['userId', 'email'],
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` WHERE userId >= 1 GROUP BY userId, email`
      )
    })

    it('should call query with correct query using single order by', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $orderBy: 'userId',
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` WHERE userId >= 1 ORDER BY userId`
      )
    })

    it('should call query with correct query using multiple order by', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $orderBy: ['userId ASC', 'email DESC'],
      })
      expect(mockQuery).toHaveBeenCalledWith(
        `SELECT * FROM \`user\` WHERE userId >= 1 ORDER BY userId ASC, email DESC`
      )
    })

    it('should call query with correct query using limit', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $limit: 10,
      })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1 LIMIT 10`)
    })

    it('should call query with correct query using limit and skip', () => {
      User.select({
        $where: { userId: { $greaterThanEqual: 1 } },
        $limit: [1, 2],
      })
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM \`user\` WHERE userId >= 1 LIMIT 1, 2`)
    })
  })

  describe('truncate', () => {
    it('should call query with correct params and return results', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.truncate()
      expect(mockQuery).toHaveBeenCalledWith(`TRUNCATE TABLE \`user\``)
      expect(result).toEqual([{ affectedRows: 1 }])
    })
  })

  describe('update', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.update(
        { username: 'testUser' },
        { userId: { $greaterThanEqual: 1 } }
      )
      expect(mockQuery).toHaveBeenCalledWith(
        `UPDATE \`user\` SET username = 'testUser' WHERE userId >= 1`
      )
      expect(result).toEqual([{ affectedRows: 1 }])
    })

    it('should call query with correct params and return false when affected rows = 0', async () => {
      mockResponse = { affectedRows: 0 }
      const result = await User.update(
        { username: 'testUser' },
        { userId: { $greaterThanEqual: 1 } }
      )
      expect(mockQuery).toHaveBeenCalledWith(
        `UPDATE \`user\` SET username = 'testUser' WHERE userId >= 1`
      )
      expect(result).toEqual([{ affectedRows: 0 }])
    })
  })

  describe('upsert', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.upsert({ ...mockUser, userId: 1 })
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username, userId) VALUES ('test@test.com', 'password', 'testUser', 1) ON DUPLICATE KEY UPDATE email = 'test@test.com', password = 'password', username = 'testUser'`
      )
      expect(result).toEqual([{ affectedRows: 1 }])
    })
  })

  describe('upsertOne', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 1 }
      const result = await User.upsertOne({ ...mockUser, userId: 1 })
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username, userId) VALUES ('test@test.com', 'password', 'testUser', 1) ON DUPLICATE KEY UPDATE email = 'test@test.com', password = 'password', username = 'testUser'`
      )
      expect(result).toBe(true)
    })
  })

  describe('upsertMany', () => {
    it('should call query with correct params and return true when affected rows = 1', async () => {
      mockResponse = { affectedRows: 2 }
      const result = await User.upsertMany([
        { ...mockUser, userId: 1 },
        { ...mockUser2, userId: 2 },
      ])
      expect(mockQuery).toHaveBeenCalledWith(
        `INSERT INTO \`user\` (email, password, username, userId) VALUES ('test@test.com', 'password', 'testUser', 1), ('test2@test.com', 'password2', 'testUser2', 2) AS MANY ON DUPLICATE KEY UPDATE email = MANY.email, password = MANY.password, username = MANY.username`
      )
      expect(result).toBe(true)
    })
  })
})
