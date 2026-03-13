import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { useState, useRef, useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { HiOutlineSearch, HiChevronRight, HiOutlineX } from 'react-icons/hi'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import navigationIcon from '@/configs/navigation-icon.config'
import { apiGetGlobalSearchResults } from '@/services/CommonService'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useThemeClass from '@/utils/hooks/useThemeClass'

export type GlobalSearchData = {
  id: string
  title: string
  subtitle?: string
  url: string
  icon?: string
  avatar?: string
  category: string
  categoryTitle: string
  type: 'navigation' | 'product' | 'order' | 'customer' | 'contact' | 'inventory'
  metadata?: Record<string, any>
}

export type GlobalSearchResult = {
  title: string
  data: GlobalSearchData[]
}

const recommendedSearch: GlobalSearchResult[] = [
  {
    title: 'Recommended',
    data: [
      {
        id: 'sales-dashboard',
        title: 'Sales Dashboard',
        url: '/app/sales/dashboard',
        icon: 'sales',
        category: 'Sales',
        categoryTitle: 'Apps',
        type: 'navigation',
      },
      {
        id: 'product-list',
        title: 'Product List',
        url: '/app/sales/product-list',
        icon: 'sales',
        category: 'Sales',
        categoryTitle: 'Apps',
        type: 'navigation',
      },
      {
        id: 'order-list',
        title: 'Order List',
        url: '/app/sales/order-list',
        icon: 'sales',
        category: 'Sales',
        categoryTitle: 'Apps',
        type: 'navigation',
      },
      {
        id: 'crm-dashboard',
        title: 'CRM Dashboard',
        url: '/app/crm/dashboard',
        icon: 'crm',
        category: 'CRM',
        categoryTitle: 'Apps',
        type: 'navigation',
      },
      {
        id: 'inventory-dashboard',
        title: 'Inventory Dashboard',
        url: '/app/inventory/dashboard',
        icon: 'inventory',
        category: 'Inventory',
        categoryTitle: 'Apps',
        type: 'navigation',
      },
    ],
  },
]

const ListItem = (props: {
  item: GlobalSearchData
  isLast?: boolean
  keyWord: string
  onNavigate: () => void
}) => {
  const { item, isLast, keyWord, onNavigate } = props
  const { textTheme } = useThemeClass()

  const renderIcon = () => {
    if (item.avatar) {
      return (
        <Avatar
          src={item.avatar}
          alt={item.title}
          size="sm"
          className="mr-3"
        />
      )
    }
    
    if (item.icon && navigationIcon[item.icon]) {
      return (
        <div
          className={classNames(
            'mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm text-xl group-hover:shadow h-6 w-6 flex items-center justify-center bg-white dark:bg-gray-700',
            textTheme,
            'dark:text-gray-100'
          )}
        >
          {navigationIcon[item.icon]}
        </div>
      )
    }

    // Default icon based on type
    const typeIcons = {
      product: '📦',
      order: '📋',
      customer: '👤',
      contact: '📞',
      inventory: '📊',
      navigation: '🔗',
    }

    return (
      <div
        className={classNames(
          'mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm text-xl group-hover:shadow h-6 w-6 flex items-center justify-center bg-white dark:bg-gray-700',
          textTheme,
          'dark:text-gray-100'
        )}
      >
        {typeIcons[item.type] || '📄'}
      </div>
    )
  }

  const renderMetadata = () => {
    if (!item.metadata) return null

    const badges = []
    
    if (item.metadata.status) {
      badges.push(
        <Badge
          key="status"
          className={classNames(
            'text-xs',
            item.metadata.statusColor || 'bg-gray-100 text-gray-800'
          )}
        >
          {item.metadata.status}
        </Badge>
      )
    }

    if (item.metadata.price) {
      badges.push(
        <span key="price" className="text-xs text-gray-500">
          ${item.metadata.price}
        </span>
      )
    }

    if (item.metadata.date) {
      badges.push(
        <span key="date" className="text-xs text-gray-500">
          {item.metadata.date}
        </span>
      )
    }

    return badges.length > 0 ? (
      <div className="flex items-center gap-2 mt-1">
        {badges}
      </div>
    ) : null
  }

  return (
    <Link to={item.url} onClick={onNavigate}>
      <div
        className={classNames(
          'flex items-center justify-between rounded-lg p-3.5 cursor-pointer user-select',
          'bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700/90',
          !isLast && 'mb-3'
        )}
      >
        <div className='flex items-center flex-1'>
          {renderIcon()}
          <div className='flex-1'>
            <div className='text-gray-900 dark:text-gray-300'>
              <Highlighter
                autoEscape
                highlightClassName={classNames(
                  textTheme,
                  'underline bg-transparent font-semibold dark:text-white'
                )}
                searchWords={[keyWord]}
                textToHighlight={item.title}
              />
            </div>
            {item.subtitle && (
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                <Highlighter
                  autoEscape
                  highlightClassName={classNames(
                    textTheme,
                    'underline bg-transparent font-medium'
                  )}
                  searchWords={[keyWord]}
                  textToHighlight={item.subtitle}
                />
              </div>
            )}
            {renderMetadata()}
          </div>
        </div>
        <HiChevronRight className='text-lg ml-2' />
      </div>
    </Link>
  )
}

const _GlobalSearch = ({ className }: { className?: string }) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [searchResult, setSearchResult] = useState<GlobalSearchResult[]>(recommendedSearch)
  const [noResult, setNoResult] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleReset = () => {
    setNoResult(false)
    setSearchResult(recommendedSearch)
    setLoading(false)
  }

  const handleSearchOpen = () => {
    setSearchDialogOpen(true)
  }

  const handleSearchClose = () => {
    setSearchDialogOpen(false)
    if (noResult) {
      setTimeout(() => {
        handleReset()
      }, 300)
    }
  }

  const debounceFn = debounce(handleDebounceFn, 300)

  async function handleDebounceFn(query: string) {
    if (!query) {
      setSearchResult(recommendedSearch)
      setLoading(false)
      return
    }

    if (noResult) {
      setNoResult(false)
    }

    setLoading(true)
    
    try {
      const response = await apiGetGlobalSearchResults<GlobalSearchResult[]>({ query })
      if (response.data) {
        if (response.data.length === 0) {
          setNoResult(true)
        }
        setSearchResult(response.data)
      }
    } catch (error) {
      console.error('Search error:', error)
      setNoResult(true)
      setSearchResult([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFn(e.target.value)
  }

  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      handleReset()
    }
  }

  useEffect(() => {
    if (searchDialogOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [searchDialogOpen])

  const handleNavigate = () => {
    handleSearchClose()
  }

  return (
    <>
      <div
        className={classNames(className, 'text-2xl cursor-pointer')}
        onClick={handleSearchOpen}
      >
        <HiOutlineSearch />
      </div>
      <Dialog
        contentClassName='p-0'
        isOpen={searchDialogOpen}
        closable={false}
        onRequestClose={handleSearchClose}
      >
        <div>
          <div className='px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600'>
            <div className='flex items-center flex-1'>
              <HiOutlineSearch className='text-xl mr-3' />
              <input
                ref={inputRef}
                className='ring-0 outline-none block w-full p-4 text-base bg-transparent text-gray-900 dark:text-gray-100'
                placeholder='Search products, orders, customers, contacts...'
                onChange={handleSearch}
              />
              {inputRef.current?.value && (
                <Button
                  size='xs'
                  variant='plain'
                  icon={<HiOutlineX />}
                  onClick={handleClearSearch}
                  className='mr-2'
                />
              )}
            </div>
            <Button size='xs' onClick={handleSearchClose}>
              Esc
            </Button>
          </div>
          <div className='py-6 px-5 max-h-[550px] overflow-y-auto'>
            {loading && (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100'></div>
                <span className='ml-3 text-gray-600 dark:text-gray-400'>Searching...</span>
              </div>
            )}
            
            {!loading && searchResult.map(result => (
              <div key={result.title} className='mb-6'>
                <h6 className='mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                  {result.title} {result.data.length > 0 && `(${result.data.length})`}
                </h6>
                {result.data.map((data, index) => (
                  <ListItem
                    key={data.id + index}
                    item={data}
                    keyWord={inputRef.current?.value || ''}
                    onNavigate={handleNavigate}
                    isLast={index === result.data.length - 1}
                  />
                ))}
              </div>
            ))}
            
            {!loading && searchResult.length === 0 && noResult && (
              <div className='my-10 text-center text-lg'>
                <div className='text-6xl mb-4'>🔍</div>
                <div className='text-gray-600 dark:text-gray-400'>
                  <span>No results for </span>
                  <span className='heading-text font-semibold'>
                    "{inputRef.current?.value}"
                  </span>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
                  Try searching for products, orders, customers, or contacts
                </p>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  )
}

const GlobalSearch = withHeaderItem(_GlobalSearch)

export default GlobalSearch