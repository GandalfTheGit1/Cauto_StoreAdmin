import { useState, useCallback, useMemo } from 'react'
import debounce from 'lodash/debounce'

export interface UseSearchOptions {
  searchFields?: string[]
  debounceMs?: number
  caseSensitive?: boolean
}

export interface SearchResult<T> {
  items: T[]
  query: string
  hasResults: boolean
  isSearching: boolean
}

export function useSearch<T extends Record<string, any>>(
  data: T[],
  options: UseSearchOptions = {}
) {
  const {
    searchFields = [],
    debounceMs = 300,
    caseSensitive = false
  } = options

  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const searchFunction = useCallback((searchQuery: string, items: T[]) => {
    if (!searchQuery.trim()) {
      return items
    }

    const searchTerm = caseSensitive ? searchQuery : searchQuery.toLowerCase()

    return items.filter(item => {
      // If no specific fields are provided, search all string fields
      const fieldsToSearch = searchFields.length > 0 
        ? searchFields 
        : Object.keys(item).filter(key => typeof item[key] === 'string')

      return fieldsToSearch.some(field => {
        const fieldValue = item[field]
        if (typeof fieldValue !== 'string') return false
        
        const value = caseSensitive ? fieldValue : fieldValue.toLowerCase()
        return value.includes(searchTerm)
      })
    })
  }, [searchFields, caseSensitive])

  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      setIsSearching(false)
    }, debounceMs),
    [debounceMs]
  )

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    debouncedSearch(searchQuery)
  }, [debouncedSearch])

  const filteredItems = useMemo(() => {
    return searchFunction(query, data)
  }, [data, query, searchFunction])

  const result: SearchResult<T> = {
    items: filteredItems,
    query,
    hasResults: filteredItems.length > 0,
    isSearching
  }

  return {
    ...result,
    handleSearch,
    clearSearch: () => setQuery(''),
  }
}

export default useSearch