import { describe, it, expect } from 'vitest'
import sortBy from '../sortBy'

describe('sortBy', () => {
  const testData = [
    { name: 'John', age: 30, score: 85.5 },
    { name: 'Alice', age: 25, score: 92.0 },
    { name: 'Bob', age: 35, score: 78.3 },
    { name: 'Charlie', age: 28, score: 88.7 },
  ]

  describe('string sorting', () => {
    it('should sort by string field in ascending order', () => {
      const sorted = [...testData].sort(sortBy('name', false))
      expect(sorted.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie', 'John'])
    })

    it('should sort by string field in descending order', () => {
      const sorted = [...testData].sort(sortBy('name', true))
      expect(sorted.map(item => item.name)).toEqual(['John', 'Charlie', 'Bob', 'Alice'])
    })
  })

  describe('number sorting', () => {
    it('should sort by number field in ascending order', () => {
      const sorted = [...testData].sort(sortBy('age', false))
      expect(sorted.map(item => item.age)).toEqual([25, 28, 30, 35])
    })

    it('should sort by number field in descending order', () => {
      const sorted = [...testData].sort(sortBy('age', true))
      expect(sorted.map(item => item.age)).toEqual([35, 30, 28, 25])
    })

    it('should sort by decimal number field', () => {
      const sorted = [...testData].sort(sortBy('score', false))
      expect(sorted.map(item => item.score)).toEqual([78.3, 85.5, 88.7, 92.0])
    })
  })

  describe('with primer function', () => {
    it('should apply primer function to values before sorting', () => {
      const primer = (value: string | number | boolean) => 
        typeof value === 'string' ? value.toLowerCase() : value

      const mixedCaseData = [
        { name: 'john', value: 1 },
        { name: 'ALICE', value: 2 },
        { name: 'Bob', value: 3 },
      ]

      const sorted = [...mixedCaseData].sort(sortBy('name', false, primer))
      expect(sorted.map(item => item.name)).toEqual(['ALICE', 'Bob', 'john'])
    })

    it('should work with numeric primer', () => {
      const primer = (value: string | number | boolean) => 
        typeof value === 'number' ? Math.abs(value as number) : value

      const negativeData = [
        { name: 'A', value: -10 },
        { name: 'B', value: 5 },
        { name: 'C', value: -3 },
      ]

      const sorted = [...negativeData].sort(sortBy('value', false, primer))
      expect(sorted.map(item => item.value)).toEqual([-3, 5, -10])
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const sorted = [].sort(sortBy('name', false))
      expect(sorted).toEqual([])
    })

    it('should handle single item array', () => {
      const singleItem = [{ name: 'John', age: 30 }]
      const sorted = [...singleItem].sort(sortBy('name', false))
      expect(sorted).toEqual(singleItem)
    })

    it('should handle equal values', () => {
      const equalData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 30 },
        { name: 'Bob', age: 30 },
      ]

      const sorted = [...equalData].sort(sortBy('age', false))
      expect(sorted.every(item => item.age === 30)).toBe(true)
    })

    it('should handle boolean values', () => {
      const booleanData = [
        { name: 'A', active: true },
        { name: 'B', active: false },
        { name: 'C', active: true },
      ]

      const sorted = [...booleanData].sort(sortBy('active', false))
      expect(sorted.map(item => item.active)).toEqual([false, true, true])
    })
  })
})