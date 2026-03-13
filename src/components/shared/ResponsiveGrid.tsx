import { ReactNode } from 'react'
import classNames from 'classnames'

interface ResponsiveGridProps {
  children: ReactNode
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: number
  className?: string
}

/**
 * ResponsiveGrid component that adapts column count based on screen size
 * Default: 1 column on mobile, 2 on tablet, 3 on desktop
 */
const ResponsiveGrid = ({
  children,
  columns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 3, '2xl': 4 },
  gap = 4,
  className = '',
}: ResponsiveGridProps) => {
  const gridClasses = classNames(
    'grid',
    `gap-${gap}`,
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    columns['2xl'] && `2xl:grid-cols-${columns['2xl']}`,
    className
  )

  return <div className={gridClasses}>{children}</div>
}

export default ResponsiveGrid
