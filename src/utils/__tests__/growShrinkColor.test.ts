import { describe, it, expect } from 'vitest'
import growShrinkColor from '../growShrinkColor'

describe('growShrinkColor', () => {
  describe('positive values', () => {
    it('should return green background classes for positive values', () => {
      const result = growShrinkColor(5, 'bg')
      expect(result).toBe('bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100')
    })

    it('should return green text classes for positive values', () => {
      const result = growShrinkColor(10, 'text')
      expect(result).toBe('text-emerald-600 dark:text-emerald-400')
    })
  })

  describe('negative values', () => {
    it('should return red background classes for negative values', () => {
      const result = growShrinkColor(-5, 'bg')
      expect(result).toBe('bg-red-100 dark:bg-red-500/20 dark:text-red-100')
    })

    it('should return red text classes for negative values', () => {
      const result = growShrinkColor(-10, 'text')
      expect(result).toBe('text-red-600 dark:text-red-500')
    })
  })

  describe('zero values', () => {
    it('should return empty string for zero with bg type', () => {
      const result = growShrinkColor(0, 'bg')
      expect(result).toBe('')
    })

    it('should return empty string for zero with text type', () => {
      const result = growShrinkColor(0, 'text')
      expect(result).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should handle very small positive values', () => {
      const result = growShrinkColor(0.1, 'text')
      expect(result).toBe('text-emerald-600 dark:text-emerald-400')
    })

    it('should handle very small negative values', () => {
      const result = growShrinkColor(-0.1, 'text')
      expect(result).toBe('text-red-600 dark:text-red-500')
    })

    it('should handle large positive values', () => {
      const result = growShrinkColor(1000, 'bg')
      expect(result).toBe('bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100')
    })

    it('should handle large negative values', () => {
      const result = growShrinkColor(-1000, 'bg')
      expect(result).toBe('bg-red-100 dark:bg-red-500/20 dark:text-red-100')
    })
  })
})