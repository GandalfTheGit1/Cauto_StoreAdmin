import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AsyncContent from '../AsyncContent'

describe('AsyncContent', () => {
  it('should render loading state when loading is true', () => {
    render(
      <AsyncContent loading={true}>
        <div>Content</div>
      </AsyncContent>
    )

    // Check for spinner element (SVG)
    expect(document.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('should render children when loading is false', () => {
    render(
      <AsyncContent loading={false}>
        <div>Content</div>
      </AsyncContent>
    )

    expect(document.querySelector('svg')).not.toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render error state when error is provided', () => {
    render(
      <AsyncContent loading={false} error="Something went wrong">
        <div>Content</div>
      </AsyncContent>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('should render empty state when isEmpty is true and emptyState is provided', () => {
    const emptyState = <div>No data available</div>

    render(
      <AsyncContent loading={false} isEmpty={true} emptyState={emptyState}>
        <div>Content</div>
      </AsyncContent>
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })
})