import { ReactNode } from 'react'
import classNames from 'classnames'
import { HiOutlineSearch } from 'react-icons/hi'

export interface SearchResultsProps {
  query: string
  totalResults: number
  isSearching?: boolean
  hasResults: boolean
  children: ReactNode
  className?: string
  emptyStateMessage?: string
  emptyStateIcon?: ReactNode
}

const SearchResults = ({
  query,
  totalResults,
  isSearching = false,
  hasResults,
  children,
  className,
  emptyStateMessage,
  emptyStateIcon,
}: SearchResultsProps) => {
  const renderEmptyState = () => {
    if (query.trim() === '') {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {emptyStateIcon || <HiOutlineSearch className="mx-auto h-12 w-12" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start searching
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Enter a search term to find items
          </p>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          {emptyStateIcon || <HiOutlineSearch className="mx-auto h-12 w-12" />}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {emptyStateMessage || `No items match "${query}". Try adjusting your search terms.`}
        </p>
      </div>
    )
  }

  const renderSearchInfo = () => {
    if (query.trim() === '' || isSearching) return null

    return (
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {hasResults ? (
          <>
            Found <span className="font-semibold">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "
            <span className="font-semibold">{query}</span>"
          </>
        ) : (
          <>
            No results for "<span className="font-semibold">{query}</span>"
          </>
        )}
      </div>
    )
  }

  const renderLoadingState = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Searching...</p>
    </div>
  )

  return (
    <div className={classNames('search-results', className)}>
      {renderSearchInfo()}
      
      {isSearching ? (
        renderLoadingState()
      ) : hasResults ? (
        <div className="search-results-content">
          {children}
        </div>
      ) : (
        renderEmptyState()
      )}
    </div>
  )
}

export default SearchResults