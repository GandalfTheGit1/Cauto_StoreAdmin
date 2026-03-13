import { ReactNode } from 'react'
import classNames from 'classnames'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  mobilePadding?: string
  desktopPadding?: string
}

/**
 * ResponsiveContainer that adjusts padding and spacing based on screen size
 */
const ResponsiveContainer = ({
  children,
  className = '',
  mobilePadding = 'p-4',
  desktopPadding = 'p-6',
}: ResponsiveContainerProps) => {
  return (
    <div
      className={classNames(
        mobilePadding,
        `md:${desktopPadding}`,
        className
      )}
    >
      {children}
    </div>
  )
}

export default ResponsiveContainer
