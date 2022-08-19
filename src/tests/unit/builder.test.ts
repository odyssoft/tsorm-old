import { builder, parseInsert, parseOptions, parseValue } from '../../builder'
import model from '../../model'
import { ModelKeys } from '../../types'

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

describe('builder', () => {
  const Builder = builder<IMock>(mockModel)

  describe('delete', () => {
    it('should return correct delete script as number', () => {
      const result = Builder.delete({ age: 5 })

      expect(result).toBe('DELETE FROM `mock` WHERE age = 5')
    })

    it('should return correct delete script as string', () => {
      const result = Builder.delete({ name: 'test' })

      expect(result).toBe("DELETE FROM `mock` WHERE name = 'test'")
    })

    it('should return correct delete script as tinyint', () => {
      const result = Builder.delete({ isActive: false })

      expect(result).toBe('DELETE FROM `mock` WHERE isActive = 0')
    })
  })

  describe('insert', () => {
    it('should return correct insert script with single line', () => {
      const result = Builder.insert({ name: 'test', age: 5, isActive: true })
      expect(result).toBe("INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, 1)")
    })

    it('should return correct insert script with multiple lines', () => {
      const result = Builder.insert([
        { name: 'test', age: 5 },
        { name: 'test2', age: 6, isActive: false },
      ])
      expect(result).toBe(
        "INSERT INTO `mock` (name, age, isActive) VALUES ('test', 5, NULL), ('test2', 6, 0)"
      )
    })
  })

  describe('select', () => {
    it('should return correct select script with no params', () => {
      const result = Builder.select()
      expect(result).toBe('SELECT * FROM `mock`')
    })

    it('should return correct select script with columns params', () => {
      const result = Builder.select({ $columns: ['name', 'age'] })
      expect(result).toBe('SELECT name, age FROM `mock`')
    })

    it('should return correct select script with where params', () => {
      const result = Builder.select({ $where: { age: 5 } })
      expect(result).toBe('SELECT * FROM `mock` WHERE age = 5')
    })

    it('should return correct select script with where params and columns params', () => {
      const result = Builder.select({ $where: { age: 5 }, $columns: ['name', 'age'] })
      expect(result).toBe('SELECT name, age FROM `mock` WHERE age = 5')
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
      const result = builder<any>(mockJoin).select()
      expect(result).toBe(
        'SELECT * FROM `mock` AS m INNER JOIN `mock2` AS s ON m.id = s.senderId INNER JOIN `mock2` AS r ON m.id = r.receiverId'
      )
    })
  })

  describe('update', () => {
    it('should return correct update script', () => {
      const result = Builder.update({ isActive: true, name: 'Test User' }, { id: 1 })
      expect(result).toBe("UPDATE `mock` SET isActive = 1, name = 'Test User' WHERE id = 1")
    })
  })

  describe('truncate', () => {
    it('should return correct truncate script', () => {
      const result = Builder.truncate()
      expect(result).toBe('TRUNCATE `mock`')
    })
  })
})
