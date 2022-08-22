import { OkPacket, FieldPacket } from 'mysql2'
import { builder } from '../../builder'
import model from '../../model'

type IMock = {
  id?: number
  name: string
  age: number
  isActive?: boolean
}

const mockModel = model<IMock>('mock', {
  id: {
    type: 'INT',
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  age: {
    type: 'INT',
    required: true,
  },
  isActive: {
    type: 'TINYINT',
    default: false,
  },
})

type IMock2 = {
  id?: number
  senderId: number
  receiverId: number
}

const mockModel2 = model<IMock2>('mock2', {
  id: {
    type: 'INT',
    autoIncrement: true,
    primaryKey: true,
  },
  senderId: {
    type: 'INT',
    required: true,
  },
  receiverId: {
    type: 'INT',
    required: true,
  },
})

let mockPromise = Promise.resolve([{}])
const mockQuery = jest.fn(() => mockPromise)

describe('builder', () => {
  const Builder = builder<IMock>({
    ...mockModel,
    connection: {
      query: mockQuery,
    },
  })

  describe('delete', () => {
    it('should return correct delete script as number', () => {
      Builder.delete({ age: 5 })
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM `mock` WHERE age = 5')
    })

    it('should return correct delete script as string', () => {
      Builder.delete({ name: 'test' })
      expect(mockQuery).toHaveBeenCalledWith("DELETE FROM `mock` WHERE name = 'test'")
    })

    it('should return correct delete script as tinyint', () => {
      Builder.delete({ isActive: false })
      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM `mock` WHERE isActive = 0')
    })
  })

  describe('insert', () => {
    it('should return correct insert script with single line', () => {
      Builder.insert({ name: 'test', age: 5, isActive: true })
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, 1)"
      )
    })

    it('should return correct insert script with multiple lines', () => {
      Builder.insert([
        { name: 'test', age: 5 },
        { name: 'test2', age: 6, isActive: false },
      ])
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, NULL), ('test2', 6, 0)"
      )
    })
  })

  describe('select', () => {
    it('should return correct select script with no params', () => {
      Builder.select()
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM `mock`')
    })

    it('should return correct select script with columns params', () => {
      Builder.select({ $columns: ['name', 'age'] })
      expect(mockQuery).toHaveBeenCalledWith('SELECT name, age FROM `mock`')
    })

    it('should return correct select script with where params', () => {
      Builder.select({ $where: { age: 5 } })
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM `mock` WHERE age = 5')
    })

    it('should return correct select script with where params and columns params', () => {
      Builder.select({ $where: { age: 5 }, $columns: ['name', 'age'] })
      expect(mockQuery).toHaveBeenCalledWith('SELECT name, age FROM `mock` WHERE age = 5')
    })

    it('should return correct select script with joins', () => {
      const mockJoin = mockModel
        .as<'m'>('m')
        .join(mockModel2.as<'s'>('s'), {
          'm.id': 's.senderId',
        })
        .join(mockModel2.as<'r'>('r'), {
          'm.id': 'r.receiverId',
        })
      builder<any>({
        ...mockJoin,
        connection: {
          query: mockQuery,
        },
      }).select()
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM `mock` AS m INNER JOIN `mock2` AS s ON m.id = s.senderId INNER JOIN `mock2` AS r ON m.id = r.receiverId'
      )
    })
  })

  describe('update', () => {
    it('should return correct update script', () => {
      Builder.update({ isActive: true, name: 'Test User' }, { id: 1 })
      expect(mockQuery).toHaveBeenCalledWith(
        "UPDATE `mock` SET isActive = 1, name = 'Test User' WHERE id = 1"
      )
    })
  })

  describe('truncate', () => {
    it('should return correct truncate script', () => {
      Builder.truncate()
      expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE `mock`')
    })
  })

  describe('upsert', () => {
    it('should return correct upsert script with single line', () => {
      Builder.upsert({ name: 'test', age: 5, isActive: true })
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, 1) ON DUPLICATE KEY UPDATE name = 'test', age = 5, isActive = 1"
      )
    })

    it('should return correct upsert script with multiple lines', () => {
      Builder.upsert([
        { name: 'test', age: 5 },
        { name: 'test2', age: 6, isActive: false },
      ])
      expect(mockQuery).toHaveBeenCalledWith(
        "INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, NULL), ('test2', 6, 0) AS MANY ON DUPLICATE KEY UPDATE name = MANY.name, age = MANY.age, isActive = MANY.isActive"
      )
    })
  })
})
