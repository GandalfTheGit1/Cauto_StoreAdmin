import { ReactNode } from 'react'
import useResponsive from '@/utils/hooks/useResponsive'
import Card from '@/components/ui/Card'

interface ResponsiveTableProps {
  children: ReactNode
  mobileView?: ReactNode
  className?: string
}

/**
 * ResponsiveTable wrapper that provides mobile-friendly table display
 * On mobile, it can show a custom mobile view or wrap the table in a scrollable container
 */
const ResponsiveTable = ({
  children,
  mobileView,
  className = '',
}: ResponsiveTableProps) => {
  const { smaller } = useResponsive()

  // Show custom mobile view if provided and on mobile
  if (smaller.md && mobileView) {
    return <div className={className}>{mobileView}</div>
  }

  // On mobile without custom view, make table horizontally scrollable
  if (smaller.md) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="min-w-max">{children}</div>
      </div>
    )
  }

  // Desktop view
  return <div className={className}>{children}</div>
}

export default ResponsiveTable
