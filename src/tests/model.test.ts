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
  describe('getKeys', () => {
    it('should return default keys without joins', () => {
      //  @ts-ignore
      const keys = User.getKeys()
      expect(keys).toEqual(['userId', 'username', 'email', 'password'])
    })
  })

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

  describe('insert', () => {
    it('should call query with correct params for single insert', async () => {
      await User.insert({ ...mockUser })
      console.log({ mockUser })
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
      expect(result).toBe(4)
    })
  })

  describe('deleteBy', () => {
    it('should call query with correct params and return number of affected rows', async () => {
      mockResponse = { affectedRows: 4 }
      const result = await User.deleteBy('userId', { $greaterThanEqual: 1 })
      expect(mockQuery).toHaveBeenCalledWith(`DELETE FROM \`user\` WHERE userId >= 1`)
      expect(result).toBe(4)
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
      const users = await User.find({ $where: { userId: { $greaterThanEqual: 1 } } })
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
      const user = await User.findOne({ $where: { userId: { $greaterThanEqual: 1 } } })
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
    it('should call query with correct params and return correct database entry', async () => {
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
  })

  describe('truncate', () => {
    it('should call query with correct params and return true', async () => {
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
      expect(result).toBe(true)
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
      expect(result).toBe(false)
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
