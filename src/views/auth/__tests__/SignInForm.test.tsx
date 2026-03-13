import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignInForm from '../SignIn/SignInForm'
import appConfig from '@/configs/app.config'

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
    SALES: {
      email: 'sales@demo.com',
      password: 'demo123',
    },
    INVENTORY: {
      email: 'inventory@demo.com',
      password: 'demo123',
    },
    CRM: {
      email: 'crm@demo.com',
      password: 'demo123',
    },
  },
}))

describe('SignInForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    onSubmit: mockOnSubmit,
    message: '',
  }

  describe('rendering', () => {
    it('should render sign in form with email and password fields', () => {
      render(<SignInForm {...defaultProps} />)

      expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
    })

    it('should show demo credentials when mock is enabled', () => {
      render(<SignInForm {...defaultProps} />)

      expect(screen.getByText(/demo mode/i)).toBeInTheDocument()
      expect(screen.getByText(/admin@demo.com/)).toBeInTheDocument()
      expect(screen.getByText(/sales@demo.com/)).toBeInTheDocument()
    })

    it('should display error message when provided', () => {
      render(<SignInForm {...defaultProps} message="Invalid credentials" />)

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('should pre-fill demo credentials when mock is enabled', () => {
      render(<SignInForm {...defaultProps} />)

      const emailInput = screen.getByPlaceholderText('Correo') as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText('Contraseña') as HTMLInputElement

      expect(emailInput.value).toBe('admin@demo.com')
      expect(passwordInput.value).toBe('demo123')
    })
  })

  describe('form validation', () => {
    it('should show validation error for empty email', async () => {
      render(<SignInForm {...defaultProps} />)

      const emailInput = screen.getByPlaceholderText('Correo')
      const submitButton = screen.getByRole('button', { name: /ingresar/i })

      await userEvent.clear(emailInput)
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por Favor, introduzca su correo')).toBeInTheDocument()
      })
    })

    it('should show validation error for empty password', async () => {
      render(<SignInForm {...defaultProps} />)

      const passwordInput = screen.getByPlaceholderText('Contraseña')
      const submitButton = screen.getByRole('button', { name: /ingresar/i })

      await userEvent.clear(passwordInput)
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por Favor, introduzca su Contraseña')).toBeInTheDocument()
      })
    })
  })

  describe('form submission', () => {
    it('should call onSubmit with form values when form is valid', async () => {
      render(<SignInForm {...defaultProps} />)

      const emailInput = screen.getByPlaceholderText('Correo')
      const passwordInput = screen.getByPlaceholderText('Contraseña')
      const submitButton = screen.getByRole('button', { name: /ingresar/i })

      await userEvent.clear(emailInput)
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.clear(passwordInput)
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
            password: 'password123',
          }),
          expect.any(Function)
        )
      })
    })

    it('should not call onSubmit when form is disabled', async () => {
      render(<SignInForm {...defaultProps} disableSubmit={true} />)

      const submitButton = screen.getByRole('button', { name: /ingresar/i })
      await userEvent.click(submitButton)

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show loading state during submission', async () => {
      const slowOnSubmit = vi.fn().mockImplementation((values, setSubmitting) => {
        // Simulate async operation
        setTimeout(() => setSubmitting(false), 100)
      })

      render(<SignInForm {...defaultProps} onSubmit={slowOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /ingresar/i })
      await userEvent.click(submitButton)

      expect(screen.getByText('Ingresando...')).toBeInTheDocument()
    })
  })

  describe('contact link', () => {
    it('should render contact link', () => {
      render(<SignInForm {...defaultProps} />)

      const contactLink = screen.getByText('Contactanos')
      expect(contactLink).toBeInTheDocument()
      expect(contactLink.closest('a')).toHaveAttribute('href', 'https://wa.me/+5358419139')
    })
  })
})