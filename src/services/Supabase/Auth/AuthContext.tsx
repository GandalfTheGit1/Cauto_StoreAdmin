// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import appConfig from '@/configs/app.config'
import { getCurrentUser, isDemoAuthenticated } from '@/services/AuthService'
import supabase from '@/services/Supabase/BaseClient'

interface AuthContextType {
  user: any
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (appConfig.enableMock) {
      // Use demo authentication
      const demoUser = getCurrentUser()
      setUser(demoUser)
    } else {
      // Recuperar la sesión actual al cargar la aplicación
      const loadUser = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      }

      loadUser()

      // Escuchar cambios en la autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
        }
      )

      return () => {
        authListener?.subscription.unsubscribe()
      }
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (appConfig.enableMock) {
      // Demo mode - not implemented for this context
      throw new Error('Demo sign up not implemented in this context')
    }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    if (appConfig.enableMock) {
      // Demo mode - not implemented for this context
      throw new Error('Demo sign in not implemented in this context')
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (appConfig.enableMock) {
      // Clear demo user
      setUser(null)
      localStorage.removeItem('demo-auth-token')
      localStorage.removeItem('demo-user-data')
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
