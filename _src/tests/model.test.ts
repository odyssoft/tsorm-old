import { model } from '../../model'

type MockModelType = {
  mockId: number
  mockName: string
}

const mockModel = model<MockModelType>('mock', {
  mockId: {
    autoIncrement: true,
    primaryKey: true,
    required: true,
    type: 'INT',
  },
  mockName: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})

describe('model', () => {
  it('should return correct aliased model', () => {
    expect(mockModel.alias).toBeUndefined()
    const alias = mockModel.as('m')
    expect(alias.alias).toBe('m')
  })

  describe('delete', () => {})
  describe('insert', () => {})
  describe('select', () => {})
  describe('update', () => {})
})
