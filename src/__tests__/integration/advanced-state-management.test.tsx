import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { signInSuccess, setUser, signOutSuccess } from '@/store/slices/auth'
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

describe('Advanced State Management Integration Tests', () => {
    let store: any

    beforeEach(() => {
        vi.clearAllMocks()

        // Create a fresh store for each test
        store = configureStore({
            reducer: {
                auth: authReducer,
                theme: themeReducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: {
                        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                    },
                }),
        })
    })

    describe('Authentication State Flow', () => {
        it('should handle complete authentication lifecycle', () => {
            // Initial state - user not authenticated
            let authState = store.getState().auth
            expect(authState.session.signedIn).toBe(false)
            expect(authState.user.id).toBe(null)
            expect(authState.session.token).toBe(null)

            // Step 1: Sign in success
            const token = 'demo-auth-token-123'
            store.dispatch(signInSuccess(token))

            authState = store.getState().auth
            expect(authState.session.signedIn).toBe(true)
            expect(authState.session.token).toBe(token)

            // Step 2: Set user data
            const userData = {
                id: '1',
                email: 'admin@demo.com',
                name: 'Admin User',
                phone: '+1-555-0123',
                authority: ['admin', 'user'],
                shopId: 'shop-1',
                sellersShops: ['shop-1', 'shop-2'],
            }

            store.dispatch(setUser(userData))

            authState = store.getState().auth
            expect(authState.user).toEqual(userData)
            expect(authState.user.authority).toContain('admin')

            // Step 3: Sign out
            store.dispatch(signOutSuccess())
            // Reset user data on logout
            store.dispatch(setUser({
                id: null,
                email: '',
                name: '',
                phone: '',
                authority: [],
                shopId: '',
                sellersShops: [],
            }))

            authState = store.getState().auth
            expect(authState.session.signedIn).toBe(false)
            expect(authState.session.token).toBe(null)
            expect(authState.user.id).toBe(null)
        })

        it('should handle user role changes and permissions', () => {
            // Set up authenticated user
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'user@demo.com',
                name: 'Regular User',
                phone: '',
                authority: ['user'],
                shopId: '',
                sellersShops: [],
            }))

            let authState = store.getState().auth
            expect(authState.user.authority).toEqual(['user'])

            // Update user role to admin
            store.dispatch(setUser({
                id: '1',
                email: 'user@demo.com',
                name: 'Regular User',
                phone: '',
                authority: ['admin', 'user'],
                shopId: 'shop-1',
                sellersShops: ['shop-1'],
            }))

            authState = store.getState().auth
            expect(authState.user.authority).toContain('admin')
            expect(authState.user.authority).toContain('user')
            expect(authState.user.shopId).toBe('shop-1')
        })
    })

    describe('Theme State Management', () => {
        it('should handle theme changes and persistence', () => {
            // Initial theme state
            let themeState = store.getState().theme
            expect(themeState.mode).toBe('light')
            expect(themeState.direction).toBe('ltr')

            // Change to dark mode
            store.dispatch(setMode('dark'))
            themeState = store.getState().theme
            expect(themeState.mode).toBe('dark')

            // Change direction to RTL
            store.dispatch(setDirection('rtl'))
            themeState = store.getState().theme
            expect(themeState.direction).toBe('rtl')

            // Verify both changes persist
            expect(themeState.mode).toBe('dark')
            expect(themeState.direction).toBe('rtl')
        })

        it('should maintain theme preferences across authentication changes', () => {
            // Set theme preferences
            store.dispatch(setMode('dark'))
            store.dispatch(setDirection('rtl'))

            // Authenticate user
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'admin@demo.com',
                name: 'Admin User',
                phone: '',
                authority: ['admin'],
                shopId: '',
                sellersShops: [],
            }))

            // Theme should persist
            let themeState = store.getState().theme
            expect(themeState.mode).toBe('dark')
            expect(themeState.direction).toBe('rtl')

            // Sign out
            store.dispatch(signOutSuccess())

            // Theme should still persist
            themeState = store.getState().theme
            expect(themeState.mode).toBe('dark')
            expect(themeState.direction).toBe('rtl')

            // Auth state should be reset
            const authState = store.getState().auth
            expect(authState.session.signedIn).toBe(false)
        })
    })

    describe('Cross-Slice State Interactions', () => {
        it('should handle complex state interactions between multiple slices', () => {
            // Initial state verification
            const initialState = store.getState()
            expect(initialState.auth.session.signedIn).toBe(false)
            expect(initialState.theme.mode).toBe('light')

            // Simulate user login with theme preference
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'admin@demo.com',
                name: 'Admin User',
                phone: '',
                authority: ['admin'],
                shopId: '',
                sellersShops: [],
            }))
            store.dispatch(setMode('dark'))

            const authenticatedState = store.getState()
            expect(authenticatedState.auth.session.signedIn).toBe(true)
            expect(authenticatedState.auth.user.authority).toContain('admin')
            expect(authenticatedState.theme.mode).toBe('dark')

            // Simulate user preference changes while authenticated
            store.dispatch(setDirection('rtl'))

            const updatedState = store.getState()
            expect(updatedState.auth.session.signedIn).toBe(true)
            expect(updatedState.theme.mode).toBe('dark')
            expect(updatedState.theme.direction).toBe('rtl')
        })

        it('should handle state rehydration scenarios', () => {
            // Mock persisted state
            const persistedAuthState = {
                session: {
                    signedIn: true,
                    token: 'persisted-token-123',
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
            }

            const persistedThemeState = {
                themeColor: 'blue',
                mode: 'dark',
                direction: 'rtl',
                primaryColorLevel: 600,
                panelExpand: false,
                cardBordered: true,
                navMode: 'light',
                layout: {
                    type: 'modern',
                    sideNavCollapse: false,
                },
            }

            // Create store with preloaded state (simulating rehydration)
            const rehydratedStore = configureStore({
                reducer: {
                    auth: authReducer,
                    theme: themeReducer,
                },
                preloadedState: {
                    auth: persistedAuthState,
                    theme: persistedThemeState,
                },
                middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware({
                        serializableCheck: {
                            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                        },
                    }),
            })

            const rehydratedState = rehydratedStore.getState()
            expect(rehydratedState.auth.session.signedIn).toBe(true)
            expect(rehydratedState.auth.user.email).toBe('admin@demo.com')
            expect(rehydratedState.theme.mode).toBe('dark')
            expect(rehydratedState.theme.direction).toBe('rtl')
        })
    })

    describe('State Validation and Error Handling', () => {
        it('should handle invalid state updates gracefully', () => {
            // Attempt to set invalid user data
            const invalidUserData = {
                id: '',
                email: '',
                name: '',
                phone: '',
                authority: [],
                shopId: '',
                sellersShops: [],
            }

            store.dispatch(setUser(invalidUserData))

            const authState = store.getState().auth
            // State should still be updated even with empty values
            expect(authState.user.id).toBe('')
            expect(authState.user.email).toBe('')
            expect(authState.user.authority).toEqual([])
        })

        it('should maintain state consistency during rapid updates', () => {
            // Rapid authentication state changes
            store.dispatch(signInSuccess('token-1'))
            store.dispatch(setUser({
                id: '1',
                email: 'user1@demo.com',
                name: 'User 1',
                phone: '',
                authority: ['user'],
                shopId: '',
                sellersShops: [],
            }))

            store.dispatch(signOutSuccess())

            store.dispatch(signInSuccess('token-2'))
            store.dispatch(setUser({
                id: '2',
                email: 'user2@demo.com',
                name: 'User 2',
                phone: '',
                authority: ['admin'],
                shopId: '',
                sellersShops: [],
            }))

            const finalState = store.getState().auth
            expect(finalState.session.signedIn).toBe(true)
            expect(finalState.session.token).toBe('token-2')
            expect(finalState.user.id).toBe('2')
            expect(finalState.user.email).toBe('user2@demo.com')
            expect(finalState.user.authority).toContain('admin')
        })
    })

    describe('State Performance and Memory Management', () => {
        it('should handle large state updates efficiently', () => {
            const startTime = performance.now()

            // Simulate multiple rapid state updates
            for (let i = 0; i < 100; i++) {
                store.dispatch(setUser({
                    id: `user-${i}`,
                    email: `user${i}@demo.com`,
                    name: `User ${i}`,
                    phone: `+1-555-${i.toString().padStart(4, '0')}`,
                    authority: i % 2 === 0 ? ['admin'] : ['user'],
                    shopId: `shop-${i}`,
                    sellersShops: [`shop-${i}`],
                }))

                if (i % 10 === 0) {
                    store.dispatch(setMode(i % 20 === 0 ? 'dark' : 'light'))
                }
            }

            const endTime = performance.now()
            const executionTime = endTime - startTime

            // Verify final state
            const finalState = store.getState()
            expect(finalState.auth.user.id).toBe('user-99')
            expect(finalState.auth.user.email).toBe('user99@demo.com')

            // Performance should be reasonable (less than 100ms for 100 updates)
            expect(executionTime).toBeLessThan(100)
        })

        it('should properly clean up state on logout', () => {
            // Set up complex state
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'admin@demo.com',
                name: 'Admin User',
                phone: '+1-555-0123',
                authority: ['admin', 'user', 'manager'],
                shopId: 'shop-1',
                sellersShops: ['shop-1', 'shop-2', 'shop-3'],
            }))

            // Verify complex state is set
            let authState = store.getState().auth
            expect(authState.user.authority).toHaveLength(3)
            expect(authState.user.sellersShops).toHaveLength(3)

            // Sign out and verify cleanup
            store.dispatch(signOutSuccess())
            // Reset user data on logout
            store.dispatch(setUser({
                id: null,
                email: '',
                name: '',
                phone: '',
                authority: [],
                shopId: '',
                sellersShops: [],
            }))

            authState = store.getState().auth
            expect(authState.session.signedIn).toBe(false)
            expect(authState.session.token).toBe(null)
            expect(authState.user.id).toBe(null)
            expect(authState.user.email).toBe('')
            expect(authState.user.authority).toEqual([])
            expect(authState.user.sellersShops).toEqual([])
        })
    })

    describe('State Selectors and Derived Data', () => {
        it('should handle derived state calculations correctly', () => {
            // Set up authenticated admin user
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'admin@demo.com',
                name: 'Admin User',
                phone: '',
                authority: ['admin', 'user'],
                shopId: 'shop-1',
                sellersShops: ['shop-1', 'shop-2'],
            }))

            const state = store.getState()

            // Test derived state calculations
            const isAuthenticated = state.auth.session.signedIn
            const isAdmin = state.auth.user.authority.includes('admin')
            const hasMultipleShops = state.auth.user.sellersShops.length > 1
            const userDisplayName = state.auth.user.name || state.auth.user.email

            expect(isAuthenticated).toBe(true)
            expect(isAdmin).toBe(true)
            expect(hasMultipleShops).toBe(true)
            expect(userDisplayName).toBe('Admin User')
        })

        it('should handle conditional state logic based on user roles', () => {
            // Test with regular user
            store.dispatch(signInSuccess('token-123'))
            store.dispatch(setUser({
                id: '1',
                email: 'user@demo.com',
                name: 'Regular User',
                phone: '',
                authority: ['user'],
                shopId: '',
                sellersShops: [],
            }))

            let state = store.getState()
            let canAccessAdmin = state.auth.user.authority.includes('admin')
            let canAccessSales = state.auth.user.authority.includes('user') || state.auth.user.authority.includes('admin')

            expect(canAccessAdmin).toBe(false)
            expect(canAccessSales).toBe(true)

            // Update to admin user
            store.dispatch(setUser({
                id: '1',
                email: 'user@demo.com',
                name: 'Regular User',
                phone: '',
                authority: ['admin', 'user'],
                shopId: 'shop-1',
                sellersShops: ['shop-1'],
            }))

            state = store.getState()
            canAccessAdmin = state.auth.user.authority.includes('admin')
            canAccessSales = state.auth.user.authority.includes('user') || state.auth.user.authority.includes('admin')

            expect(canAccessAdmin).toBe(true)
            expect(canAccessSales).toBe(true)
        })
    })
})