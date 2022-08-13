import { formatValue, operator } from '../../operator'
import { ModelKeys } from '../../types'

type IMock = {
  id: number
  name: string
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
  },
}

describe('Operator', () => {
  describe('operator()', () => {
    const Operator = operator<IMock>('id', mockKeys)
    it('should return an object with all the operator functions', () => {
      expect(Operator).toHaveProperty('$between')
      expect(Operator).toHaveProperty('$equals')
      expect(Operator).toHaveProperty('$greaterThan')
      expect(Operator).toHaveProperty('$greaterThanEqual')
      expect(Operator).toHaveProperty('$in')
      expect(Operator).toHaveProperty('$lessThan')
      expect(Operator).toHaveProperty('$lessThanEqual')
      expect(Operator).toHaveProperty('$like')
      expect(Operator).toHaveProperty('$notBetween')
      expect(Operator).toHaveProperty('$notEquals')
      expect(Operator).toHaveProperty('$notIn')
      expect(Operator).toHaveProperty('$notLike')
    })

    it('should return $between correctly', () => {
      const result = Operator.$between({ max: 5, min: 0 })
      expect(result).toBe('id BETWEEN 0 AND 5')
    })

    it('should return $equals correctly', () => {
      const result = Operator.$equals(5)
      expect(result).toBe('id = 5')
    })

    it('should return $greaterThan correctly', () => {
      const result = Operator.$greaterThan(5)
      expect(result).toBe('id > 5')
    })

    it('should return $greaterThanEqual correctly', () => {
      const result = Operator.$greaterThanEqual(5)
      expect(result).toBe('id >= 5')
    })

    it('should return $in correctly', () => {
      const result = Operator.$in([5, 6, 7])
      expect(result).toBe('id IN (5, 6, 7)')
    })

    it('should return $lessThan correctly', () => {
      const result = Operator.$lessThan(5)
      expect(result).toBe('id < 5')
    })

    it('should return $lessThanEqual correctly', () => {
      const result = Operator.$lessThanEqual(5)
      expect(result).toBe('id <= 5')
    })

    it('should return $like correctly', () => {
      const result = Operator.$like('%test%')
      expect(result).toBe("id LIKE '%test%'")
    })

    it('should return $notBetween correctly', () => {
      const result = Operator.$notBetween({ max: 5, min: 0 })
      expect(result).toBe('id NOT BETWEEN 0 AND 5')
    })

    it('should return $notEquals correctly', () => {
      const result = Operator.$notEquals(5)
      expect(result).toBe('id != 5')
    })

    it('should return $notIn correctly', () => {
      const result = Operator.$notIn([5, 6, 7])
      expect(result).toBe('id NOT IN (5, 6, 7)')
    })

    it('should return $notLike correctly', () => {
      const result = Operator.$notLike('%test%')
      expect(result).toBe("id NOT LIKE '%test%'")
    })
  })

  describe('formatValue()', () => {
    type IMockAlias = {
      't.id': number
      't.name': string
    }
    const mockAliasKeys: ModelKeys<IMockAlias> = {
      't.id': {
        type: 'INT',
        autoIncrement: true,
        primaryKey: true,
      },
      't.name': {
        type: 'VARCHAR',
        length: 255,
      },
    }

    it('should return a number when number is passed', () => {
      const result = formatValue(5)
      expect(result).toBe(5)
    })

    it('should return a string when string is passed', () => {
      const result = formatValue('test')
      expect(result).toBe("'test'")
    })

    it('should return a 0 when false boolean is passed', () => {
      const result = formatValue(false)
      expect(result).toBe(0)
    })

    it('should return a 1 when true boolean is passed', () => {
      const result = formatValue(true)
      expect(result).toBe(1)
    })

    it('should return key when key is passed', () => {
      const result = formatValue<IMock>('id', mockKeys)
      expect(result).toBe('id')
    })

    it('should return aliased key when aliased key is passed', () => {
      const result = formatValue<IMockAlias>('t.id', mockAliasKeys)
      expect(result).toBe('t.id')
    })
  })
})
