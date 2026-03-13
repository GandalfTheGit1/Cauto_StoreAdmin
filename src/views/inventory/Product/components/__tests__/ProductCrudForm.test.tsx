import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCrudForm from '../ProductCrudForm'

// Mock the ProductService
vi.mock('@/services/ProductService', () => ({
  apiUploadProductImage: vi.fn(),
}))

describe('ProductCrudForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  }

  describe('rendering', () => {
    it('should render form fields correctly', () => {
      render(<ProductCrudForm {...defaultProps} />)

      expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/stock/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/brand/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/vendor/i)).toBeInTheDocument()
    })

    it('should show save button in create mode', () => {
      render(<ProductCrudForm {...defaultProps} />)

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should show delete button in edit mode', () => {
      render(<ProductCrudForm {...defaultProps} isEdit={true} onDelete={mockOnDelete} />)

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('should populate form with initial data', () => {
      const initialData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        brand: 'Test Brand',
        vendor: 'Test Vendor',
        category: 'devices',
      }

      render(<ProductCrudForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('99.99')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Brand')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Vendor')).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show validation errors for required fields', async () => {
      render(<ProductCrudForm {...defaultProps} />)

      const saveButton = screen.getByRole('button', { name: /save/i })
      await userEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('Product name is required')).toBeInTheDocument()
        expect(screen.getByText('Description is required')).toBeInTheDocument()
        expect(screen.getByText('Category is required')).toBeInTheDocument()
        expect(screen.getByText('Price is required')).toBeInTheDocument()
        expect(screen.getByText('Stock is required')).toBeInTheDocument()
        expect(screen.getByText('Brand is required')).toBeInTheDocument()
        expect(screen.getByText('Vendor is required')).toBeInTheDocument()
      })
    })

    it('should validate positive numbers for price and stock', async () => {
      render(<ProductCrudForm {...defaultProps} />)

      const priceInput = screen.getByLabelText(/price/i)
      const stockInput = screen.getByLabelText(/stock/i)

      await userEvent.type(priceInput, '-10')
      await userEvent.type(stockInput, '-5')
      await userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('Price must be positive')).toBeInTheDocument()
        expect(screen.getByText('Stock must be positive')).toBeInTheDocument()
      })
    })
  })

  describe('form submission', () => {
    it('should call onSubmit with form data when valid', async () => {
      render(<ProductCrudForm {...defaultProps} />)

      // Fill out the form
      await userEvent.type(screen.getByLabelText(/product name/i), 'New Product')
      await userEvent.type(screen.getByLabelText(/description/i), 'Product description')
      await userEvent.type(screen.getByLabelText(/price/i), '29.99')
      await userEvent.type(screen.getByLabelText(/stock/i), '50')
      await userEvent.type(screen.getByLabelText(/brand/i), 'Brand Name')
      await userEvent.type(screen.getByLabelText(/vendor/i), 'Vendor Name')
      
      // Select category
      const categorySelect = screen.getByLabelText(/category/i)
      await userEvent.click(categorySelect)
      await userEvent.click(screen.getByText('Electronics & Devices'))

      await userEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Product',
            description: 'Product description',
            price: 29.99,
            stock: 50,
            brand: 'Brand Name',
            vendor: 'Vendor Name',
            category: 'devices',
          }),
          expect.any(Function)
        )
      })
    })

    it('should call onCancel when cancel button is clicked', async () => {
      render(<ProductCrudForm {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should show delete confirmation dialog when delete is clicked', async () => {
      render(<ProductCrudForm {...defaultProps} isEdit={true} onDelete={mockOnDelete} />)

      await userEvent.click(screen.getByRole('button', { name: /delete/i }))

      expect(screen.getByText(/are you sure you want to delete this product/i)).toBeInTheDocument()
    })

    it('should call onDelete when delete is confirmed', async () => {
      render(<ProductCrudForm {...defaultProps} isEdit={true} onDelete={mockOnDelete} />)

      await userEvent.click(screen.getByRole('button', { name: /delete/i }))
      await userEvent.click(screen.getByRole('button', { name: /confirm/i }))

      expect(mockOnDelete).toHaveBeenCalled()
    })
  })

  describe('category options', () => {
    it('should display all category options', async () => {
      render(<ProductCrudForm {...defaultProps} />)

      const categorySelect = screen.getByLabelText(/category/i)
      await userEvent.click(categorySelect)

      expect(screen.getByText('Electronics & Devices')).toBeInTheDocument()
      expect(screen.getByText('Watches & Timepieces')).toBeInTheDocument()
      expect(screen.getByText('Bags & Luggage')).toBeInTheDocument()
      expect(screen.getByText('Shoes & Footwear')).toBeInTheDocument()
      expect(screen.getByText('Clothing')).toBeInTheDocument()
      expect(screen.getByText('Accessories')).toBeInTheDocument()
    })
  })
})