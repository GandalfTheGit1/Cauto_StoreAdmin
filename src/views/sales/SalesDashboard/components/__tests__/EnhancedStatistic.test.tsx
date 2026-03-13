import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EnhancedStatistic from '../EnhancedStatistic'

describe('EnhancedStatistic', () => {
  const mockData = {
    revenue: { value: 150000, growShrink: 12.5 },
    orders: { value: 1200, growShrink: -5.2 },
    customers: { value: 800, growShrink: 8.7 },
    conversion: { value: 3.2, growShrink: 1.1 },
    aov: { value: 125, growShrink: -2.3 },
    purchases: { value: 950, growShrink: 15.8 }
  }

  describe('loading state', () => {
    it('should render loading skeleton when no data provided', () => {
      render(<EnhancedStatistic />)

      // Check for loading skeleton cards
      const skeletonCards = document.querySelectorAll('.animate-pulse')
      expect(skeletonCards.length).toBe(6)
    })

    it('should render loading skeleton when data is undefined', () => {
      render(<EnhancedStatistic data={undefined} />)

      const skeletonCards = document.querySelectorAll('.animate-pulse')
      expect(skeletonCards.length).toBe(6)
    })
  })

  describe('data rendering', () => {
    it('should render all stat cards when complete data is provided', () => {
      render(<EnhancedStatistic data={mockData} />)

      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('Total Orders')).toBeInTheDocument()
      expect(screen.getByText('Customers')).toBeInTheDocument()
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
      expect(screen.getByText('Avg Order Value')).toBeInTheDocument()
      expect(screen.getByText('Purchases')).toBeInTheDocument()
    })

    it('should render only provided stat cards when partial data is given', () => {
      const partialData = {
        revenue: { value: 150000, growShrink: 12.5 },
        orders: { value: 1200, growShrink: -5.2 }
      }

      render(<EnhancedStatistic data={partialData} />)

      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('Total Orders')).toBeInTheDocument()
      expect(screen.queryByText('Customers')).not.toBeInTheDocument()
      expect(screen.queryByText('Conversion Rate')).not.toBeInTheDocument()
    })
  })

  describe('value formatting', () => {
    it('should format currency values correctly', () => {
      const data = {
        revenue: { value: 150000, growShrink: 12.5 },
        aov: { value: 125.75, growShrink: -2.3 }
      }

      render(<EnhancedStatistic data={data} />)

      expect(screen.getByText('$150,000')).toBeInTheDocument()
      expect(screen.getByText('$126')).toBeInTheDocument() // Rounded to nearest dollar
    })

    it('should format number values correctly', () => {
      const data = {
        orders: { value: 1200, growShrink: -5.2 },
        customers: { value: 800, growShrink: 8.7 }
      }

      render(<EnhancedStatistic data={data} />)

      expect(screen.getByText('1,200')).toBeInTheDocument()
      expect(screen.getByText('800')).toBeInTheDocument()
    })

    it('should format percentage values correctly', () => {
      const data = {
        conversion: { value: 3.2567, growShrink: 1.1 }
      }

      render(<EnhancedStatistic data={data} />)

      expect(screen.getByText('3.3%')).toBeInTheDocument() // Rounded to 1 decimal
    })
  })

  describe('growth indicators', () => {
    it('should show positive growth indicator for positive values', () => {
      const data = {
        revenue: { value: 150000, growShrink: 12.5 }
      }

      render(<EnhancedStatistic data={data} />)

      const growthIndicator = screen.getByText('12.5%')
      expect(growthIndicator).toBeInTheDocument()
      
      // Check for positive growth styling (green background)
      const growthContainer = growthIndicator.closest('div')
      expect(growthContainer).toHaveClass('bg-green-100')
    })

    it('should show negative growth indicator for negative values', () => {
      const data = {
        orders: { value: 1200, growShrink: -5.2 }
      }

      render(<EnhancedStatistic data={data} />)

      const growthIndicator = screen.getByText('5.2%') // Absolute value
      expect(growthIndicator).toBeInTheDocument()
      
      // Check for negative growth styling (red background)
      const growthContainer = growthIndicator.closest('div')
      expect(growthContainer).toHaveClass('bg-red-100')
    })

    it('should show zero growth as positive', () => {
      const data = {
        revenue: { value: 150000, growShrink: 0 }
      }

      render(<EnhancedStatistic data={data} />)

      const growthIndicator = screen.getByText('0.0%')
      expect(growthIndicator).toBeInTheDocument()
      
      const growthContainer = growthIndicator.closest('div')
      expect(growthContainer).toHaveClass('bg-green-100')
    })
  })

  describe('icons', () => {
    it('should render appropriate icons for each stat type', () => {
      render(<EnhancedStatistic data={mockData} />)

      // Check that SVG icons are rendered (HeroIcons render as SVG elements)
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
    })
  })

  describe('responsive layout', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<EnhancedStatistic data={mockData} />)

      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2', 
        'lg:grid-cols-3',
        'xl:grid-cols-6'
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty data object', () => {
      render(<EnhancedStatistic data={{}} />)

      // Should render empty grid without any stat cards
      expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument()
      expect(screen.queryByText('Total Orders')).not.toBeInTheDocument()
    })

    it('should handle very large numbers', () => {
      const data = {
        revenue: { value: 1500000000, growShrink: 12.5 }
      }

      render(<EnhancedStatistic data={data} />)

      expect(screen.getByText('$1,500,000,000')).toBeInTheDocument()
    })

    it('should handle very small numbers', () => {
      const data = {
        conversion: { value: 0.1, growShrink: 1.1 }
      }

      render(<EnhancedStatistic data={data} />)

      expect(screen.getByText('0.1%')).toBeInTheDocument()
    })
  })
})