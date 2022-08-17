import { builder, parseInsert, parseOptions, parseValue } from '../../builder'
import model from '../../model'
import { ModelKeys } from '../../types'

type IMock = {
  id: number
  name: string
  age: number
  isActive: boolean
}

const mockKeys: ModelKeys<IMock> = {
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
}

const mockModel = model<IMock>('mock', mockKeys)

describe('builder', () => {
  const Builder = builder<IMock>(mockModel)
  it('should return correct delete scriipt as number', () => {
    const result = Builder.delete({ age: 5 })

    expect(result).toBe('DELETE FROM `mock` WHERE age = 5')
  })

  it('should return correct delete scriipt as string', () => {
    const result = Builder.delete({ name: 'test' })

    expect(result).toBe("DELETE FROM `mock` WHERE name = 'test'")
  })

  it('should return correct delete scriipt as tinyint', () => {
    const result = Builder.delete({ isActive: false })

    expect(result).toBe('DELETE FROM `mock` WHERE isActive = 0')
  })
})
