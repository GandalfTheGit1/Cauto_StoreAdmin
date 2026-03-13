import { describe, it, expect } from 'vitest'
import acronym from '../acronym'

describe('acronym', () => {
  it('should return acronym from multiple words', () => {
    expect(acronym('John Doe')).toBe('JD')
    expect(acronym('React TypeScript Application')).toBe('RTA')
    expect(acronym('Customer Relationship Management')).toBe('CRM')
  })

  it('should return first letter from single word', () => {
    expect(acronym('React')).toBe('R')
    expect(acronym('TypeScript')).toBe('T')
  })

  it('should handle empty string', () => {
    expect(acronym('')).toBe('')
    expect(acronym()).toBe('')
  })

  it('should handle strings with extra spaces', () => {
    expect(acronym('  John   Doe  ')).toBe('JD')
    expect(acronym('React  TypeScript   Application')).toBe('RTA')
  })

  it('should handle strings with special characters', () => {
    expect(acronym('John-Doe Smith')).toBe('JDS')
    expect(acronym('React.js TypeScript')).toBe('RjT') // 'j' is captured as word boundary
  })

  it('should handle numbers in names', () => {
    expect(acronym('Version 2.0 Release')).toBe('V20R') // '2' and '0' are captured
    expect(acronym('Project 123 Management')).toBe('P1M')
  })

  it('should return original string if no word boundaries found', () => {
    expect(acronym('123')).toBe('1') // Only first character captured
    expect(acronym('!!!')).toBe('!!!')
  })
})