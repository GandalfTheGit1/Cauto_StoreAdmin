import { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const EmptyState = ({
  title = 'No data available',
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button variant="solid" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  )
}

export default EmptyState
