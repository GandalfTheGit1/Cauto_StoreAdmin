import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  describe('rendering', () => {
    it('should render with default title', () => {
      render(<EmptyState />)

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('should render with custom title', () => {
      render(<EmptyState title="Custom Title" />)

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })

    it('should render with description when provided', () => {
      render(
        <EmptyState 
          title="No Items" 
          description="There are no items to display at this time." 
        />
      )

      expect(screen.getByText('No Items')).toBeInTheDocument()
      expect(screen.getByText('There are no items to display at this time.')).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      render(<EmptyState title="No Items" />)

      expect(screen.getByText('No Items')).toBeInTheDocument()
      expect(screen.queryByText('There are no items to display at this time.')).not.toBeInTheDocument()
    })

    it('should render with custom icon', () => {
      const customIcon = <div data-testid="custom-icon">📦</div>

      render(<EmptyState icon={customIcon} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('should not render icon container when no icon provided', () => {
      const { container } = render(<EmptyState />)

      // Check that there's no icon container div
      const iconContainer = container.querySelector('.flex.justify-center.mb-4')
      expect(iconContainer).not.toBeInTheDocument()
    })
  })

  describe('action button', () => {
    it('should render action button when action is provided', () => {
      const mockAction = {
        label: 'Add Item',
        onClick: vi.fn()
      }

      render(<EmptyState action={mockAction} />)

      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
    })

    it('should call onClick when action button is clicked', async () => {
      const mockOnClick = vi.fn()
      const mockAction = {
        label: 'Add Item',
        onClick: mockOnClick
      }

      render(<EmptyState action={mockAction} />)

      const button = screen.getByRole('button', { name: 'Add Item' })
      await userEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not render action button when no action provided', () => {
      render(<EmptyState />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<EmptyState className="custom-class" />)

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should have default styling classes', () => {
      const { container } = render(<EmptyState />)

      expect(container.firstChild).toHaveClass('text-center', 'py-12')
    })
  })

  describe('complete component', () => {
    it('should render all elements when all props are provided', () => {
      const mockOnClick = vi.fn()
      const customIcon = <div data-testid="custom-icon">📦</div>
      const mockAction = {
        label: 'Create New',
        onClick: mockOnClick
      }

      render(
        <EmptyState
          title="No Products"
          description="You haven't created any products yet. Get started by creating your first product."
          icon={customIcon}
          action={mockAction}
          className="custom-empty-state"
        />
      )

      expect(screen.getByText('No Products')).toBeInTheDocument()
      expect(screen.getByText("You haven't created any products yet. Get started by creating your first product.")).toBeInTheDocument()
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument()
    })
  })
})