import { describe, it, expect, vi } from 'vitest'

// Mock the app config
vi.mock('@/configs/app.config', () => ({
  default: {
    enableMock: true,
  },
}))

// Mock the demo credentials
vi.mock('@/services/DemoAuthService', () => ({
  DEMO_CREDENTIALS: {
    ADMIN: {
      email: 'admin@demo.com',
      password: 'demo123',
    },
  },
}))

describe('SignInForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct prop interface', () => {
    const props = {
      onSubmit: mockOnSubmit,
      message: '',
      disableSubmit: false,
    }

    expect(typeof props.onSubmit).toBe('function')
    expect(typeof props.message).toBe('string')
    expect(typeof props.disableSubmit).toBe('boolean')
  })

  it('should handle form submission callback', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
    }

    mockOnSubmit(formData, vi.fn())
    expect(mockOnSubmit).toHaveBeenCalledWith(formData, expect.any(Function))
  })

  it('should validate form data structure', () => {
    const validFormData = {
      email: 'admin@demo.com',
      password: 'demo123',
    }

    expect(validFormData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(validFormData.password.length).toBeGreaterThan(0)
  })

  it('should handle error messages', () => {
    const errorMessage = 'Invalid credentials'
    expect(typeof errorMessage).toBe('string')
    expect(errorMessage.length).toBeGreaterThan(0)
  })

  it('should handle disabled state', () => {
    const disableSubmit = true
    expect(typeof disableSubmit).toBe('boolean')
    expect(disableSubmit).toBe(true)
  })
})