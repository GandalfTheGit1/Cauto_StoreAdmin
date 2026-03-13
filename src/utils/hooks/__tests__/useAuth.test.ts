import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import useAuth from '../useAuth'
import rootReducer from '@/store/rootReducer'

// Mock the services
vi.mock('@/services/AuthService', () => ({
  apiSignIn: vi.fn(),
  apiSignUp: vi.fn(),
  apiSignOut: vi.fn(),
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
}))

vi.mock('@/configs/app.config', () => ({
  default: {
    enableMock: true,
    authenticatedEntryPath: '/dashboard',
    authenticatedEntryPathForSellers: '/sellers/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
  },
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/sign-in' }),
  }
})

// Mock query hook
vi.mock('../useQuery', () => ({
  default: () => new URLSearchParams(),
}))

describe('useAuth', () => {
  let store: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )

  describe('initialization', () => {
    it('should initialize with demo auth state when mock is enabled', async () => {
      const { isAuthenticated, getCurrentUser } = await import('@/services/AuthService')
      
      vi.mocked(getCurrentUser).mockReturnValue({
        id: '1',
        email: 'admin@demo.com',
        firstName: 'Admin',
        lastName: 'User',
      })
      
      localStorage.setItem('demo-auth-token', 'demo-token-123')

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(getCurrentUser).toHaveBeenCalled()
    })

    it('should return authenticated status based on token and signedIn state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      // Initially should not be authenticated
      expect(result.current.authenticated).toBe(false)
    })
  })

  describe('signIn', () => {
    it('should handle successful sign in', async () => {
      const { apiSignIn } = await import('@/services/AuthService')
      
      const mockResponse = {
        user: { id: '1', email: 'test@example.com' },
        session: { access_token: 'token123' },
        token: 'token123',
      }
      
      vi.mocked(apiSignIn).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuth(), { wrapper })

      let signInResult: any
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password')
      })

      expect(signInResult).toEqual({
        status: 'success',
        message: '',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle sign in failure', async () => {
      const { apiSignIn } = await import('@/services/AuthService')
      
      vi.mocked(apiSignIn).mockRejectedValue(new Error('Invalid credentials'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      let signInResult: any
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrong-password')
      })

      expect(signInResult).toEqual({
        status: 'failed',
        message: 'Invalid credentials',
      })
    })

    it('should navigate to sellers path when on sellers route', async () => {
      // Mock location for sellers path
      vi.mocked(require('react-router-dom').useLocation).mockReturnValue({
        pathname: '/s/sign-in',
      })

      const { apiSignIn } = await import('@/services/AuthService')
      
      const mockResponse = {
        user: { id: '1', email: 'seller@example.com' },
        session: { access_token: 'token123' },
        token: 'token123',
      }
      
      vi.mocked(apiSignIn).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signIn('seller@example.com', 'password')
      })

      expect(mockNavigate).toHaveBeenCalledWith('/sellers/dashboard')
    })
  })

  describe('signOut', () => {
    it('should handle sign out successfully', async () => {
      const { apiSignOut } = await import('@/services/AuthService')
      
      vi.mocked(apiSignOut).mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(apiSignOut).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/sign-in')
    })

    it('should handle sign out even when API call fails', async () => {
      const { apiSignOut } = await import('@/services/AuthService')
      
      vi.mocked(apiSignOut).mockRejectedValue(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(consoleSpy).toHaveBeenCalledWith('Sign out error:', expect.any(Error))
      expect(mockNavigate).toHaveBeenCalledWith('/sign-in')
      
      consoleSpy.mockRestore()
    })
  })
})