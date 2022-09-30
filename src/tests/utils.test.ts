import { DataTypes } from '../datatypes'
import { ModelKeys } from '../types'
import {
  formatValue,
  getIdKey,
  getInsertKeys,
  getInsertValues,
  mapKey,
  operator,
  parseOptions,
  parseValue,
} from '../utils'

type IMock = {
  id: number
  name: string
}
const mockKeys: ModelKeys<IMock> = {
  id: {
    type: DataTypes.int,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.varchar(255),
  },
}

describe('utils', () => {
  describe('formatValue', () => {
    it('should return null when input is undefined', () => {
      const result = formatValue(undefined)
      expect(result).toBe('NULL')
    })

    it('should return null when input is null', () => {
      const result = formatValue(null)
      expect(result).toBe('NULL')
    })

    it('should return a number when input is a number', () => {
      const result = formatValue(2)
      expect(result).toBe(2)
    })

    it('should return a 0 when input is a false', () => {
      const result = formatValue(false)
      expect(result).toBe(0)
    })

    it('should return a 1 when input is a true', () => {
      const result = formatValue(true)
      expect(result).toBe(1)
    })

    it('should return string when string without keys', () => {
      const result = formatValue('test')
      expect(result).toBe("'test'")
    })

    it('should return string when string and not in keys', () => {
      const result = formatValue('test', ['nottest'])
      expect(result).toBe("'test'")
    })

    it('should return key when string and in keys', () => {
      const result = formatValue('test', ['test', 'key'])
      expect(result).toBe('test')
    })
  })

  describe('getIdKey', () => {
    it('should return id when id is in keys', () => {
      const result = getIdKey<IMock>(mockKeys)
      expect(result).toBe('id')
    })

    it('should return key beginning with id and key is primary', () => {
      const result = getIdKey<{ idkey: number; name: string }>({
        idkey: {
          type: DataTypes.int,
          primaryKey: true,
        },
        name: {
          type: DataTypes.varchar(255),
          required: true,
        },
      })
      expect(result).toBe('idkey')
    })

    it('should return key ending with id and key is primary', () => {
      const result = getIdKey<{ keyid: number; name: string }>({
        keyid: {
          type: DataTypes.int,
          primaryKey: true,
        },
        name: {
          type: DataTypes.varchar(255),
          required: true,
        },
      })
      expect(result).toBe('keyid')
    })

    it('should return key without id in the name', () => {
      const result = getIdKey<{ mainkey: number; name: string }>({
        mainkey: {
          type: DataTypes.int,
          primaryKey: true,
        },
        name: {
          type: DataTypes.varchar(255),
          required: true,
        },
      })
      expect(result).toBe('mainkey')
    })
  })

  describe('getInsertKeys', () => {
    it('should return all keys from object', () => {
      const result = getInsertKeys({ name: '', id: '', age: '' })
      expect(result).toEqual(['name', 'id', 'age'])
    })

    it('should return all keys from array of object', () => {
      const result = getInsertKeys([
        { id: '', age: '' },
        { name: '', id: '', age: '' },
        { test: '' },
      ])
      expect(result).toEqual(['id', 'age', 'name', 'test'])
    })
  })

  describe('getInsertValues', () => {
    it('should return correct values for an individual object', () => {
      const result = getInsertValues(
        {
          test: 'ok',
          user: 123,
          active: false,
        },
        ['test', 'user', 'active']
      )
      expect(result).toBe("VALUES ('ok', 123, 0)")
    })

    it('should return correct values for an array object', () => {
      const result = getInsertValues(
        [
          { age: 25, name: 'test', active: true },
          { age: 27, name: 'user', active: false },
        ],
        ['age', 'name', 'active']
      )
      expect(result).toBe("VALUES (25, 'test', 1), (27, 'user', 0)")
    })

    it('should only return values that have valid keys', () => {
      const result = getInsertValues({ age: 25, name: 'test', random: 'asdasd', active: true }, [
        'age',
        'name',
        'active',
      ])
      expect(result).toBe("VALUES (25, 'test', 1)")
    })
  })

  describe('mapKey()', () => {
    it('should return correct string with default as string', () => {
      const result = mapKey('test', {
        type: DataTypes.varchar(255),
        autoIncrement: true,
        primaryKey: true,
        required: true,
        default: 'test',
      })
      expect(result).toBe('`test` VARCHAR(255) AUTO_INCREMENT PRIMARY KEY NOT NULL DEFAULT test')
    })

    it('should return correct string with default as number', () => {
      const result = mapKey('test', {
        type: DataTypes.int,
        autoIncrement: true,
        primaryKey: true,
        required: true,
        default: 0,
      })
      expect(result).toBe('`test` INT AUTO_INCREMENT PRIMARY KEY NOT NULL DEFAULT 0')
    })
  })

  describe('operator()', () => {
    const Operator = operator<IMock>('id', Object.keys(mockKeys))
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
        type: DataTypes.int,
        autoIncrement: true,
        primaryKey: true,
      },
      't.name': {
        type: DataTypes.varchar(255),
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
      const result = formatValue('id', Object.keys(mockKeys))
      expect(result).toBe('id')
    })

    it('should return aliased key when aliased key is passed', () => {
      const result = formatValue('t.id', Object.keys(mockAliasKeys))
      expect(result).toBe('t.id')
    })
  })

  describe('parseOptions', () => {
    it('should return correct options with a single object', () => {
      const result = parseOptions({
        name: 'test',
        age: {
          $between: {
            min: 20,
            max: 30,
          },
        },
      })
      expect(result).toBe("name = 'test' AND age BETWEEN 20 AND 30")
    })

    it('should return correct options with a single object with $or', () => {
      const result = parseOptions({
        name: 'test',
        $or: [{ age: 20 }, { age: 27 }],
      })
      expect(result).toBe("name = 'test' AND (age = 20 OR age = 27)")
    })
  })

  describe('parseValue', () => {
    it('should return correct parsed value string with null', () => {
      const result = parseValue('test', null)
      expect(result).toBe('test IS NULL')
    })

    it('should return correct parsed value string with null and keys', () => {
      const result = parseValue('test', null, Object.keys(mockKeys))
      expect(result).toBe('test IS NULL')
    })

    it('should return correct parsed value string with string', () => {
      const result = parseValue('test', 'value')
      expect(result).toBe("test = 'value'")
    })

    it('should return correct parsed value string with number', () => {
      const result = parseValue('test', 2)
      expect(result).toBe('test = 2')
    })

    it('should return correct parsed value string with operation', () => {
      const result = parseValue('test', {
        $between: {
          min: 1,
          max: 10,
        },
      })
      expect(result).toBe('test BETWEEN 1 AND 10')
    })
  })
})
