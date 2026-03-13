import { Component, ReactNode } from 'react'
import Alert from '@/components/ui/Alert'

interface InlineErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  message?: string
}

interface InlineErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class InlineErrorBoundary extends Component<
  InlineErrorBoundaryProps,
  InlineErrorBoundaryState
> {
  constructor(props: InlineErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<InlineErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Inline error:', error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert type="danger" showIcon className="my-4">
          {this.props.message || 'Failed to load this component'}
        </Alert>
      )
    }

    return this.props.children
  }
}

export default InlineErrorBoundary
