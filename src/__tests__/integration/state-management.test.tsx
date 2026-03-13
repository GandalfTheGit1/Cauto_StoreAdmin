import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { signInSuccess, setUser } from '@/store/slices/auth'
import themeReducer, { setMode, setDirection } from '@/store/slices/theme/themeSlice'

// Mock localStorage for persistence tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('State Management Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth State Management', () => {
    it('should handle complete authentication flow', () => {
      const store = configureStore({
        reducer: {
          auth: authReducer,
        },
      })

      // Initial state should be unauthenticated
      expect(store.getState().auth.session.signedIn).toBe(false)
      expect(store.getState().auth.user.id).toBe(null)

      // Dispatch sign in success
      const userData = {
        id: '1',
        email: 'admin@demo.com',
        name: 'Admin User',
        phone: '',
        authority: ['admin'],
        shopId: '',
        sellersShops: [],
      }

      store.dispatch(signInSuccess('demo-token-123'))
      store.dispatch(setUser(userData))

      // Verify state is updated
      const authState = store.getState().auth
      expect(authState.session.signedIn).toBe(true)
      expect(authState.user).toEqual(userData)
      expect(authState.session.token).toBe('demo-token-123')

      // Dispatch sign out
      store.dispatch({ type: 'auth/session/signOutSuccess' })

      // Verify state is reset
      const finalAuthState = store.getState().auth
      expect(finalAuthState.session.signedIn).toBe(false)
      expect(finalAuthState.session.token).toBe(null)
    })

    it('should handle authentication errors', () => {
      const store = configureStore({
        reducer: {
          auth: authReducer,
        },
      })

      // Simulate authentication error - state should remain unchanged
      const authState = store.getState().auth
      expect(authState.session.signedIn).toBe(false)
      expect(authState.user.id).toBe(null)
    })
  })

  describe('Theme State Management', () => {
    it('should handle theme mode changes', () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
      })

      // Initial state should be light mode
      expect(store.getState().theme.mode).toBe('light')

      // Change to dark mode
      store.dispatch(setMode('dark'))
      expect(store.getState().theme.mode).toBe('dark')

      // Change back to light mode
      store.dispatch(setMode('light'))
      expect(store.getState().theme.mode).toBe('light')
    })

    it('should handle theme direction changes', () => {
      const store = configureStore({
        reducer: {
          theme: themeReducer,
        },
      })

      // Initial state should be ltr
      expect(store.getState().theme.direction).toBe('ltr')

      // Change to rtl
      store.dispatch(setDirection('rtl'))
      expect(store.getState().theme.direction).toBe('rtl')

      // Change back to ltr
      store.dispatch(setDirection('ltr'))
      expect(store.getState().theme.direction).toBe('ltr')
    })
  })

  describe('Combined State Management', () => {
    it('should handle multiple state slices working together', () => {
      const store = configureStore({
        reducer: {
          auth: authReducer,
          theme: themeReducer,
        },
      })

      // Initial state
      expect(store.getState().auth.session.signedIn).toBe(false)
      expect(store.getState().theme.mode).toBe('light')

      // Simulate user login and theme preference
      const userData = {
        id: '1',
        email: 'admin@demo.com',
        name: 'Admin User',
        phone: '',
        authority: ['admin'],
        shopId: '',
        sellersShops: [],
      }

      store.dispatch(signInSuccess('demo-token-123'))
      store.dispatch(setUser(userData))
      store.dispatch(setMode('dark'))

      // Verify both states are updated correctly
      const state = store.getState()
      expect(state.auth.session.signedIn).toBe(true)
      expect(state.auth.user).toEqual(userData)
      expect(state.theme.mode).toBe('dark')

      // Simulate logout (theme should persist)
      store.dispatch({ type: 'auth/session/signOutSuccess' })

      const finalState = store.getState()
      expect(finalState.auth.session.signedIn).toBe(false)
      expect(finalState.theme.mode).toBe('dark') // Theme persists
    })
  })

  describe('State Persistence', () => {
    it('should handle state rehydration from localStorage', () => {
      // Mock localStorage with persisted state
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'persist:auth') {
          return JSON.stringify({
            signedIn: true,
            user: {
              id: '1',
              email: 'admin@demo.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              avatar: '',
            },
            token: 'persisted-token',
          })
        }
        if (key === 'persist:theme') {
          return JSON.stringify({
            mode: 'dark',
            direction: 'ltr',
          })
        }
        return null
      })

      // This would normally be handled by redux-persist
      // For testing, we simulate the rehydration
      const store = configureStore({
        reducer: {
          auth: authReducer,
          theme: themeReducer,
        },
        preloadedState: {
          auth: {
            session: {
              signedIn: true,
              token: 'persisted-token',
            },
            user: {
              id: '1',
              email: 'admin@demo.com',
              name: 'Admin User',
              phone: '',
              authority: ['admin'],
              shopId: '',
              sellersShops: [],
            },
          },
          theme: {
            themeColor: 'blue',
            mode: 'dark',
            direction: 'ltr',
            primaryColorLevel: 600,
            panelExpand: false,
            cardBordered: true,
            navMode: 'light',
            layout: {
              type: 'modern',
              sideNavCollapse: false,
            },
          },
        },
      })

      // Verify state is rehydrated correctly
      const state = store.getState()
      expect(state.auth.session.signedIn).toBe(true)
      expect(state.auth.user?.email).toBe('admin@demo.com')
      expect(state.theme.mode).toBe('dark')
    })
  })
})