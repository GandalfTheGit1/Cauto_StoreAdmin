import { useState } from 'react'
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import SearchInput from '@/components/shared/SearchInput'
import SearchResults from '@/components/shared/SearchResults'
import SearchHighlight from '@/components/shared/SearchHighlight'
import { GlobalSearchData } from '@/components/shared/GlobalSearch'
import { apiGetGlobalSearchResults } from '@/services/CommonService'
import useSearch from '@/utils/hooks/useSearch'

interface SearchDemoProps {
  className?: string
}

const mockData: GlobalSearchData[] = [
  {
    id: 'product-1',
    title: 'iPhone 14 Pro',
    subtitle: 'Apple • Electronics',
    url: '/app/sales/product-edit/1',
    category: 'Products',
    categoryTitle: 'Sales',
    type: 'product',
    metadata: { price: '999', status: 'In Stock' }
  },
  {
    id: 'order-1',
    title: 'Order #12345',
    subtitle: 'John Doe • $1,299',
    url: '/app/sales/order-details/12345',
    category: 'Orders',
    categoryTitle: 'Sales',
    type: 'order',
    metadata: { date: '2024-01-15', status: 'Shipped' }
  },
  {
    id: 'contact-1',
    title: 'Sarah Johnson',
    subtitle: 'TechCorp Inc • Marketing Manager',
    url: '/app/crm/customer-details?id=1',
    avatar: '/img/avatars/thumb-1.jpg',
    category: 'Contacts',
    categoryTitle: 'CRM',
    type: 'contact',
    metadata: { status: 'active' }
  }
]

const SearchDemo = ({ className }: SearchDemoProps) => {
  const [globalQuery, setGlobalQuery] = useState('')
  const [globalResults, setGlobalResults] = useState<any[]>([])
  const [globalLoading, setGlobalLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const {
    items: filteredMockData,
    query: localQuery,
    hasResults,
    isSearching,
    handleSearch: handleLocalSearch,
    clearSearch
  } = useSearch(mockData, {
    searchFields: ['title', 'subtitle', 'category'],
    debounceMs: 300
  })

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Products', label: 'Products' },
    { value: 'Orders', label: 'Orders' },
    { value: 'Contacts', label: 'Contacts' },
    { value: 'Navigation', label: 'Navigation' }
  ]

  const handleGlobalSearch = async (query: string) => {
    setGlobalQuery(query)
    
    if (!query.trim()) {
      setGlobalResults([])
      return
    }

    setGlobalLoading(true)
    try {
      const response = await apiGetGlobalSearchResults<any[]>({ query })
      setGlobalResults(response.data || [])
    } catch (error) {
      console.error('Global search error:', error)
      setGlobalResults([])
    } finally {
      setGlobalLoading(false)
    }
  }

  const renderSearchItem = (item: GlobalSearchData, searchQuery: string) => (
    <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start gap-3">
        {item.avatar ? (
          <Avatar src={item.avatar} alt={item.title} size="sm" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-lg">
              {item.type === 'product' ? '📦' : 
               item.type === 'order' ? '📋' : 
               item.type === 'contact' ? '👤' : '🔗'}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              <SearchHighlight
                text={item.title}
                searchWords={[searchQuery]}
              />
            </h4>
            <Badge className="text-xs">{item.type}</Badge>
          </div>
          
          {item.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <SearchHighlight
                text={item.subtitle}
                searchWords={[searchQuery]}
              />
            </p>
          )}
          
          {item.metadata && (
            <div className="flex items-center gap-2 text-xs">
              {item.metadata.status && (
                <Badge className={item.metadata.statusColor || 'bg-gray-100 text-gray-800'}>
                  {item.metadata.status}
                </Badge>
              )}
              {item.metadata.price && (
                <span className="text-gray-500">${item.metadata.price}</span>
              )}
              {item.metadata.date && (
                <span className="text-gray-500">{item.metadata.date}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const filteredGlobalResults = selectedCategory 
    ? globalResults.map(category => ({
        ...category,
        data: category.data?.filter((item: GlobalSearchData) => 
          item.category === selectedCategory
        ) || []
      })).filter(category => category.data.length > 0)
    : globalResults

  return (
    <div className={className}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Search Functionality Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive search across all modules with highlighting and filtering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Search */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Global Search</h2>
            <div className="space-y-4">
              <SearchInput
                placeholder="Search across all modules..."
                value={globalQuery}
                onChange={handleGlobalSearch}
                size="lg"
              />
              
              <div className="flex items-center gap-4">
                <Select
                  placeholder="Filter by category"
                  options={categoryOptions}
                  value={categoryOptions.find(option => option.value === selectedCategory)}
                  onChange={(option) => setSelectedCategory(option?.value || '')}
                  className="w-48"
                />
                {selectedCategory && (
                  <Button
                    size="sm"
                    variant="plain"
                    onClick={() => setSelectedCategory('')}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {globalLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            ) : filteredGlobalResults.length > 0 ? (
              <div className="space-y-6">
                {filteredGlobalResults.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      {category.title} ({category.data?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {category.data?.map((item: GlobalSearchData) => 
                        renderSearchItem(item, globalQuery)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : globalQuery ? (
              <div className="text-center py-8">
                <HiOutlineSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No items match "{globalQuery}". Try different search terms.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <HiOutlineSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Start searching
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter a search term to find items across all modules
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Local Search Demo */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Local Search with Hooks</h2>
            <SearchInput
              placeholder="Search local demo data..."
              value={localQuery}
              onChange={handleLocalSearch}
              size="lg"
            />
          </div>

          <SearchResults
            query={localQuery}
            totalResults={filteredMockData.length}
            isSearching={isSearching}
            hasResults={hasResults}
            className="max-h-96 overflow-y-auto"
          >
            <div className="space-y-3">
              {filteredMockData.map((item) => 
                renderSearchItem(item, localQuery)
              )}
            </div>
          </SearchResults>
        </Card>
      </div>

      {/* Search Features */}
      <Card className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Search Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <HiOutlineSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium mb-2">Global Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search across all modules from the header search bar
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 dark:text-green-400 font-bold">Ab</span>
            </div>
            <h3 className="font-medium mb-2">Search Highlighting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatic highlighting of search terms in results
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <HiOutlineFilter className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium mb-2">Smart Filtering</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter results by category, status, and other criteria
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SearchDemo