import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiDemoSignIn, apiDemoSignOut, isDemoAuthenticated, getDemoUserData, DEMO_CREDENTIALS } from '../DemoAuthService'

// Mock ApiService
vi.mock('../ApiService', () => ({
  fetchData: vi.fn(),
}))

describe('DemoAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('DEMO_CREDENTIALS', () => {
    it('should have all required demo credentials', () => {
      expect(DEMO_CREDENTIALS.ADMIN).toEqual({
        email: 'admin@demo.com',
        password: 'demo123'
      })
      expect(DEMO_CREDENTIALS.SALES).toEqual({
        email: 'sales@demo.com',
        password: 'demo123'
      })
      expect(DEMO_CREDENTIALS.INVENTORY).toEqual({
        email: 'inventory@demo.com',
        password: 'demo123'
      })
      expect(DEMO_CREDENTIALS.CRM).toEqual({
        email: 'crm@demo.com',
        password: 'demo123'
      })
      expect(DEMO_CREDENTIALS.OWNER).toEqual({
        email: 'owner@demo.com',
        password: 'demo123'
      })
    })
  })

  describe('isDemoAuthenticated', () => {
    it('should return true when both token and user data exist', () => {
      localStorage.setItem('demo-auth-token', 'demo-token-123')
      localStorage.setItem('demo-user-data', JSON.stringify({ id: '1', name: 'Test User' }))

      expect(isDemoAuthenticated()).toBe(true)
    })

    it('should return false when token is missing', () => {
      localStorage.setItem('demo-user-data', JSON.stringify({ id: '1', name: 'Test User' }))

      expect(isDemoAuthenticated()).toBe(false)
    })

    it('should return false when user data is missing', () => {
      localStorage.setItem('demo-auth-token', 'demo-token-123')

      expect(isDemoAuthenticated()).toBe(false)
    })
  })

  describe('getDemoUserData', () => {
    it('should return parsed user data when valid JSON exists', () => {
      const userData = { id: '1', name: 'Test User', email: 'test@demo.com' }
      localStorage.setItem('demo-user-data', JSON.stringify(userData))

      expect(getDemoUserData()).toEqual(userData)
    })

    it('should return null when no user data exists', () => {
      expect(getDemoUserData()).toBe(null)
    })

    it('should return null when user data is invalid JSON', () => {
      localStorage.setItem('demo-user-data', 'invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(getDemoUserData()).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Error parsing demo user data:', expect.any(SyntaxError))
      
      consoleSpy.mockRestore()
    })
  })

  describe('apiDemoSignOut', () => {
    it('should clear localStorage and return true', async () => {
      const ApiService = await import('../ApiService')
      vi.mocked(ApiService.fetchData).mockResolvedValue({})

      localStorage.setItem('demo-auth-token', 'test-token')
      localStorage.setItem('demo-user-data', '{"id": "1"}')

      const result = await apiDemoSignOut()

      expect(localStorage.getItem('demo-auth-token')).toBe(null)
      expect(localStorage.getItem('demo-user-data')).toBe(null)
      expect(result).toBe(true)
    })

    it('should clear localStorage even if API call fails', async () => {
      const ApiService = await import('../ApiService')
      vi.mocked(ApiService.fetchData).mockRejectedValue(new Error('API Error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      localStorage.setItem('demo-auth-token', 'test-token')
      localStorage.setItem('demo-user-data', '{"id": "1"}')

      const result = await apiDemoSignOut()

      expect(localStorage.getItem('demo-auth-token')).toBe(null)
      expect(localStorage.getItem('demo-user-data')).toBe(null)
      expect(result).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith('Demo sign out error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})