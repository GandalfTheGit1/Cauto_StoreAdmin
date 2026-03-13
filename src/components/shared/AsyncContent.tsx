import { ReactNode } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Loading from './Loading'

interface AsyncContentProps {
  loading: boolean
  error?: Error | string | null
  children: ReactNode
  loadingType?: 'default' | 'cover'
  loadingMessage?: string
  errorMessage?: string
  onRetry?: () => void
  emptyState?: ReactNode
  isEmpty?: boolean
}

const AsyncContent = ({
  loading,
  error,
  children,
  loadingType = 'default',
  loadingMessage,
  errorMessage,
  onRetry,
  emptyState,
  isEmpty = false,
}: AsyncContentProps) => {
  // Show loading state
  if (loading) {
    return (
      <Loading loading={loading} type={loadingType}>
        {loadingMessage && (
          <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
            {loadingMessage}
          </div>
        )}
      </Loading>
    )
  }

  // Show error state
  if (error) {
    const errorText =
      typeof error === 'string' ? error : error.message || 'An error occurred'

    return (
      <div className="p-4">
        <Alert type="danger" showIcon title="Error">
          {errorMessage || errorText}
        </Alert>
        {onRetry && (
          <div className="mt-4">
            <Button onClick={onRetry} variant="solid">
              Try Again
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Show empty state
  if (isEmpty && emptyState) {
    return <>{emptyState}</>
  }

  // Show content
  return <>{children}</>
}

export default AsyncContent
