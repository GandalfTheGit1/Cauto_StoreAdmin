import { ReactNode } from 'react'
import Card from '@/components/ui/Card'

interface ResponsiveCardListProps<T> {
  data: T[]
  renderCard: (item: T, index: number) => ReactNode
  className?: string
  cardClassName?: string
  emptyState?: ReactNode
}

/**
 * ResponsiveCardList component for displaying data in a mobile-friendly card format
 * Useful as an alternative to tables on mobile devices
 */
function ResponsiveCardList<T>({
  data,
  renderCard,
  className = '',
  cardClassName = '',
  emptyState,
}: ResponsiveCardListProps<T>) {
  if (!data || data.length === 0) {
    return emptyState ? <>{emptyState}</> : null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((item, index) => (
        <Card key={index} className={cardClassName}>
          {renderCard(item, index)}
        </Card>
      ))}
    </div>
  )
}

export default ResponsiveCardList
