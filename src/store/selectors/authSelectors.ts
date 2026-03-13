import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Basic selectors
const selectAuth = (state: RootState) => state.auth
const selectUser = (state: RootState) => state.auth.user
const selectSession = (state: RootState) => state.auth.session

// Memoized selectors
export const selectIsAuthenticated = createSelector(
  [selectSession],
  (session) => session.signedIn
)

export const selectUserAuthority = createSelector(
  [selectUser],
  (user) => user.authority || []
)

export const selectUserPermissions = createSelector(
  [selectUserAuthority],
  (authority) => {
    // Convert authority array to permission set for efficient lookups
    return new Set(authority)
  }
)

export const selectUserProfile = createSelector(
  [selectUser],
  (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    shopId: user.shopId,
  })
)

export const selectCanAccessModule = createSelector(
  [selectUserPermissions, (_, module: string) => module],
  (permissions, module) => {
    // Define module access rules
    const modulePermissions: Record<string, string[]> = {
      sales: ['OWNER', 'SELLER_FIXED'],
      inventory: ['OWNER'],
      crm: ['OWNER', 'SELLER_FIXED'],
      analytics: ['OWNER'],
    }
    
    const requiredPermissions = modulePermissions[module] || []
    return requiredPermissions.some(permission => permissions.has(permission))
  }
)