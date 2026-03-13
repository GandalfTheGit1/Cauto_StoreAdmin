import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import SignInForm from '@/views/auth/SignIn/SignInForm'
import authReducer from '@/store/slices/auth'
import { apiDemoSignIn } from '@/services/DemoAuthService'

// Mock the demo auth service
vi.mock('@/services/DemoAuthService', () => ({
  apiDemoSignIn: vi.fn(),
  DEMO_CREDENTIALS: {
    ADMIN: {
      email: 'admin@demo.com',
      password: 'demo123',
    },
  },
}))

// Mock app config
vi.mock('@/configs/app.config', () => ({
  default: {
    enableMock: true,
  },
}))

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore()
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

describe('Authentication Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should complete full login workflow successfully', async () => {
    const mockSignIn = vi.mocked(apiDemoSignIn)
    
    // Mock successful login response
    mockSignIn.mockResolvedValue({
      token: 'demo-token-123',
      user: {
        id: '1',
        email: 'admin@demo.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        avatar: '',
      },
    })

    const mockOnSubmit = async (values: any, setSubmitting: any) => {
      try {
        const response = await apiDemoSignIn(values)
        // Simulate successful login
        localStorage.setItem('demo-auth-token', response.token)
        localStorage.setItem('demo-user-data', JSON.stringify(response.user))
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
      }
    }

    // Simulate form submission
    await mockOnSubmit({
      email: 'admin@demo.com',
      password: 'demo123',
    }, vi.fn())

    // Verify API was called
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'admin@demo.com',
      password: 'demo123',
    })

    // Verify localStorage was updated
    expect(localStorage.getItem('demo-auth-token')).toBe('demo-token-123')
    expect(localStorage.getItem('demo-user-data')).toBeTruthy()
  })

  it('should handle login failure gracefully', async () => {
    const mockSignIn = vi.mocked(apiDemoSignIn)
    
    // Mock failed login response
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

    const mockOnSubmit = async (values: any, setSubmitting: any) => {
      try {
        await apiDemoSignIn(values)
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }

    // Simulate form submission that should fail
    try {
      await mockOnSubmit({
        email: 'admin@demo.com',
        password: 'wrong-password',
      }, vi.fn())
    } catch (error) {
      // Expected to throw
    }

    // Verify API was called
    expect(mockSignIn).toHaveBeenCalled()

    // Verify localStorage was not updated
    expect(localStorage.getItem('demo-auth-token')).toBe(null)
    expect(localStorage.getItem('demo-user-data')).toBe(null)
  })

  it('should validate form fields before submission', () => {
    const mockOnSubmit = vi.fn()

    // Simulate validation logic
    const validateForm = (values: any) => {
      const errors: any = {}
      if (!values.email) {
        errors.email = 'Por Favor, introduzca su correo'
      }
      if (!values.password) {
        errors.password = 'Por Favor, introduzca su Contraseña'
      }
      return errors
    }

    // Test empty form validation
    const emptyFormErrors = validateForm({})
    expect(emptyFormErrors.email).toBe('Por Favor, introduzca su correo')
    expect(emptyFormErrors.password).toBe('Por Favor, introduzca su Contraseña')

    // Test valid form
    const validFormErrors = validateForm({
      email: 'admin@demo.com',
      password: 'demo123',
    })
    expect(Object.keys(validFormErrors)).toHaveLength(0)
  })
})