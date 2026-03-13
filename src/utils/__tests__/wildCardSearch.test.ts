import { describe, it, expect } from 'vitest'
import wildCardSearch from '../wildCardSearch'

describe('wildCardSearch', () => {
  const testData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', age: 35 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28 },
  ]

  it('should search across all fields when no specific key is provided', () => {
    const result = wildCardSearch(testData, 'john')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('John Doe')
    expect(result[1].name).toBe('Bob Johnson')
  })

  it('should search in specific field when specifyKey is provided', () => {
    const result = wildCardSearch(testData, 'john', 'name')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('John Doe')
    expect(result[1].name).toBe('Bob Johnson')
  })

  it('should be case insensitive', () => {
    const result = wildCardSearch(testData, 'JOHN')
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('John Doe')
    expect(result[1].name).toBe('Bob Johnson')
  })

  it('should search by email', () => {
    const result = wildCardSearch(testData, 'test.com')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Bob Johnson')
  })

  it('should search by number fields', () => {
    const result = wildCardSearch(testData, '30')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('John Doe')
  })

  it('should return empty array when no matches found', () => {
    const result = wildCardSearch(testData, 'xyz')
    expect(result).toHaveLength(0)
  })

  it('should handle empty search input', () => {
    const result = wildCardSearch(testData, '')
    expect(result).toHaveLength(4) // All items match empty string
  })

  it('should handle empty data array', () => {
    const result = wildCardSearch([], 'john')
    expect(result).toHaveLength(0)
  })

  it('should handle null values in data', () => {
    const dataWithNull = [
      { id: 1, name: 'John', description: null },
      { id: 2, name: 'Jane', description: 'Test description' },
    ]
    const result = wildCardSearch(dataWithNull, 'john')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('John')
  })

  it('should search in specific field with null values', () => {
    const dataWithNull = [
      { id: 1, name: 'John', description: null },
      { id: 2, name: 'Jane', description: 'Test description' },
    ]
    const result = wildCardSearch(dataWithNull, 'test', 'description')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Jane')
  })
})