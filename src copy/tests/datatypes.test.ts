import { DataTypes } from '../'

describe('DataTypes', () => {
  describe('binary', () => {
    it('should return correct result', () => {
      expect(DataTypes.binary(1)).toBe('BINARY(1)')
    })
  })

  describe('bit', () => {
    it('should return correct result', () => {
      expect(DataTypes.bit(2)).toBe('BIT(2)')
    })
  })

  describe('blob', () => {
    it('should return correct result', () => {
      expect(DataTypes.blob(3)).toBe('BLOB(3)')
    })
  })

  describe('char', () => {
    it('should return correct result', () => {
      expect(DataTypes.char(4)).toBe('CHAR(4)')
    })
  })

  describe('dec', () => {
    it('should return correct result', () => {
      expect(DataTypes.dec(5, 6)).toBe('DEC(5, 6)')
    })
  })

  describe('decimal', () => {
    it('should return correct result', () => {
      expect(DataTypes.decimal(7, 8)).toBe('DECIMAL(7, 8)')
    })
  })

  describe('double', () => {
    it('should return correct result', () => {
      expect(DataTypes.double(9, 10)).toBe('DOUBLE(9, 10)')
    })
  })

  describe('doublePrecision', () => {
    it('should return correct result', () => {
      expect(DataTypes.doublePrecision(11, 12)).toBe('DOUBLE PRECISION(11, 12)')
    })
  })

  describe('enum', () => {
    it('should return correct result', () => {
      expect(DataTypes.enum(['a', 'b'])).toBe("ENUM('a', 'b')")
    })
  })

  describe('float', () => {
    it('should return correct result', () => {
      expect(DataTypes.float(13, 14)).toBe('FLOAT(13, 14)')
    })
  })

  describe('set', () => {
    it('should return correct result', () => {
      expect(DataTypes.set(['c', 'd'])).toBe("SET('c', 'd')")
    })
  })

  describe('text', () => {
    it('should return correct result', () => {
      expect(DataTypes.text(15)).toBe('TEXT(15)')
    })
  })

  describe('varBinary', () => {
    it('should return correct result', () => {
      expect(DataTypes.varBinary(16)).toBe('VARBINARY(16)')
    })
  })

  describe('varchar', () => {
    it('should return correct result', () => {
      expect(DataTypes.varchar(17)).toBe('VARCHAR(17)')
    })
  })
})
