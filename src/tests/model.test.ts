import mockPost from '../mocks/models/post'
import mockUser from '../mocks/models/user'

let mockPromise = Promise.resolve([{}])
const mockQuery = jest.fn(() => mockPromise)

const User = {
  ...mockUser,
  connection: {
    query: mockQuery,
  },
}

const Post = {
  ...mockPost,
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
    it('should call query with correct delete sql', (done) => {
      User.delete({ userId: 1 }).then(() => {
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM `user` WHERE userId = 1')
        done()
      })
    })
  })

  describe('insert()', () => {
    it('should call query with correct insert sql for single insert', (done) => {
      User.insert({ age: 27, name: 'Test' }).then(() => {
        expect(mockQuery).toHaveBeenCalledWith("INSERT INTO `user` (age, name) VALUES (27, 'Test')")
        done()
      })
    })

    it('should call query with correct insert sql for multiple rows', (done) => {
      User.insert([
        { age: 27, name: 'Test' },
        { age: 29, name: 'User' },
      ]).then(() => {
        expect(mockQuery).toHaveBeenCalledWith(
          "INSERT INTO `user` (age, name) VALUES (27, 'Test'), (29, 'User')"
        )
        done()
      })
    })
  })

  describe('select()', () => {
    it('should call query with correct select sql with no params', (done) => {
      User.select().then(() => {
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM `user`')
        done()
      })
    })

    it('should call query with correct select sql with column params', (done) => {
      User.select({ $columns: ['age', 'name'] }).then(() => {
        expect(mockQuery).toHaveBeenCalledWith('SELECT age, name FROM `user`')
        done()
      })
    })

    it('should call query with correct select sql with where params', (done) => {
      User.select({ $where: { age: { $greaterThanEqual: 27 } } }).then(() => {
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM `user` WHERE age >= 27')
        done()
      })
    })

    it('should call query with correct select sql with column and where params', (done) => {
      User.select({
        $columns: ['age', 'name'],
        $where: { age: { $greaterThanEqual: 27 } },
      }).then(() => {
        expect(mockQuery).toHaveBeenCalledWith('SELECT age, name FROM `user` WHERE age >= 27')
        done()
      })
    })

    it('should call query with correct select sql using joins', (done) => {
      const result = User.as<'u'>('u')
        .join(Post.as<'p'>('p'), {
          'u.userId': 'p.userId',
        })
        .select()
        .then(() => {
          expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM `user` AS u INNER JOIN `post` AS p ON u.userId = p.userId'
          )
          done()
        })
    })
  })
  describe('truncate()', () => {
    it('should call query with correct truncate sql', (done) => {
      User.truncate().then(() => {
        expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE `user`')
        done()
      })
    })
  })

  // describe('update()', () => {
  //   it('should call query with correct update sql', (done) => {
  //     const result = User.update(
  //       {
  //         name: 'Not Test',
  //       },
  //       {
  //         name: 'Test',
  //       }
  //     ).then(() => {
  //       expect(mockQuery).toHaveBeenCalledWith(
  //         "UPDATE `user` SET name = 'Not Test' WHERE name = 'Test'"
  //       )
  //       done()
  //     })
  //   })
  // })

  // describe('upsert()', () => {
  //   it('should call query with correct upsert sql for single upsert', (done) => {
  //     const result = User.upsert({
  //       age: 27,
  //       name: 'Test',
  //     }).then(() => {
  //       expect(mockQuery).toHaveBeenCalledWith(
  //         "INSERT INTO `user` (age, name) VALUES (27, 'Test') ON DUPLICATE KEY UPDATE age = 27, name = 'Test'"
  //       )
  //       done()
  //     })
  //   })

  //   it('should call query with correct upsert sql for multiple upserts', (done) => {
  //     const result = User.upsert([
  //       {
  //         age: 27,
  //         name: 'Test',
  //       },
  //       {
  //         age: 29,
  //         name: 'User',
  //       },
  //     ]).then(() => {
  //       expect(mockQuery).toHaveBeenCalledWith(
  //         "INSERT INTO `user` (age, name) VALUES (27, 'Test'), (29, 'User') AS MANY ON DUPLICATE KEY UPDATE age = MANY.age, name = MANY.name"
  //       )
  //       done()
  //     })
  //   })
  // })

  // describe('getKeys()', () => {
  //   it('should return default keys without joins', () => {
  //     //  @ts-ignore
  //     const keys = User.getKeys()
  //     expect(keys).toEqual(['userId', 'name', 'age'])
  //   })

  //   it('should return aliased keys with joins', () => {
  //     const joinedModel = User.as<'u'>('u').join(Post.as<'p'>('p'), {
  //       'u.userId': 'p.userId',
  //     })
  //     //  @ts-ignore
  //     const keys = joinedModel.getKeys()
  //     expect(keys).toEqual(['u.userId', 'u.name', 'u.age', 'p.postId', 'p.userId', 'p.post'])
  //   })
  // })
})
