import { describe, it, expect } from 'vitest'
import paginate from '../paginate'

describe('paginate', () => {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  describe('basic pagination', () => {
    it('should return first page correctly', () => {
      const result = paginate(testArray, 3, 1)
      expect(result).toEqual([1, 2, 3])
    })

    it('should return second page correctly', () => {
      const result = paginate(testArray, 3, 2)
      expect(result).toEqual([4, 5, 6])
    })

    it('should return third page correctly', () => {
      const result = paginate(testArray, 3, 3)
      expect(result).toEqual([7, 8, 9])
    })

    it('should return partial last page', () => {
      const result = paginate(testArray, 3, 4)
      expect(result).toEqual([10])
    })
  })

  describe('different page sizes', () => {
    it('should handle page size of 1', () => {
      const result = paginate(testArray, 1, 5)
      expect(result).toEqual([5])
    })

    it('should handle page size larger than array', () => {
      const result = paginate(testArray, 20, 1)
      expect(result).toEqual(testArray)
    })

    it('should handle page size equal to array length', () => {
      const result = paginate(testArray, 10, 1)
      expect(result).toEqual(testArray)
    })
  })

  describe('edge cases', () => {
    it('should return empty array for empty input', () => {
      const result = paginate([], 5, 1)
      expect(result).toEqual([])
    })

    it('should return empty array for page beyond array length', () => {
      const result = paginate(testArray, 3, 10)
      expect(result).toEqual([])
    })

    it('should handle page number 0 (returns empty)', () => {
      const result = paginate(testArray, 3, 0)
      expect(result).toEqual([])
    })

    it('should handle negative page number', () => {
      const result = paginate(testArray, 3, -1)
      // Negative page number results in slice(-6, -3) which returns elements
      expect(result).toEqual([5, 6, 7])
    })

    it('should handle zero page size', () => {
      const result = paginate(testArray, 0, 1)
      expect(result).toEqual([])
    })

    it('should handle negative page size', () => {
      const result = paginate(testArray, -3, 1)
      // Negative page size results in slice(-6, -3) which returns elements
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
    })
  })

  describe('with different data types', () => {
    it('should work with string array', () => {
      const stringArray = ['a', 'b', 'c', 'd', 'e']
      const result = paginate(stringArray, 2, 2)
      expect(result).toEqual(['c', 'd'])
    })

    it('should work with object array', () => {
      const objectArray = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
        { id: 4, name: 'Alice' },
      ]
      const result = paginate(objectArray, 2, 2)
      expect(result).toEqual([
        { id: 3, name: 'Bob' },
        { id: 4, name: 'Alice' },
      ])
    })
  })
})