import type { SignInCredential, User } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import ApiService from './ApiService'

export interface DemoAuthResponse {
  user: User
  token: string
  session: {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type: string
  }
}

export async function apiDemoSignIn(email: string, password: string): Promise<DemoAuthResponse> {
  try {
    const response = await ApiService.fetchData<DemoAuthResponse>({
      url: '/sign-in',
      method: 'post',
      data: { email, password },
    })
    
    // Store token in localStorage for session persistence
    if (response.token) {
      localStorage.setItem('demo-auth-token', response.token)
      localStorage.setItem('demo-user-data', JSON.stringify(response.user))
    }
    
    return response
  } catch (error) {
    console.error('Demo auth error:', error)
    throw error
  }
}

export async function apiDemoSignOut(): Promise<boolean> {
  try {
    // Clear stored demo auth data
    localStorage.removeItem('demo-auth-token')
    localStorage.removeItem('demo-user-data')
    
    await ApiService.fetchData({
      url: '/sign-out',
      method: 'post',
    })
    
    return true
  } catch (error) {
    console.error('Demo sign out error:', error)
    // Even if API call fails, clear local storage
    localStorage.removeItem('demo-auth-token')
    localStorage.removeItem('demo-user-data')
    return true
  }
}

export function getDemoAuthToken(): string | null {
  return localStorage.getItem('demo-auth-token')
}

export function getDemoUserData(): User | null {
  const userData = localStorage.getItem('demo-user-data')
  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error('Error parsing demo user data:', error)
      return null
    }
  }
  return null
}

export function isDemoAuthenticated(): boolean {
  const token = getDemoAuthToken()
  const userData = getDemoUserData()
  return !!(token && userData)
}

// Demo user credentials for easy access
export const DEMO_CREDENTIALS = {
  ADMIN: { email: 'admin@demo.com', password: 'demo123' },
  USER: { email: 'demo@demo.com', password: 'demo123' },
  SALES: { email: 'sales@demo.com', password: 'demo123' },
  INVENTORY: { email: 'inventory@demo.com', password: 'demo123' },
  CRM: { email: 'crm@demo.com', password: 'demo123' },
  OWNER: { email: 'owner@demo.com', password: 'demo123' },
}