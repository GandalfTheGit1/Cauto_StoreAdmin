import { useState, useRef, useEffect } from 'react'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import classNames from 'classnames'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
  showClearButton?: boolean
  disabled?: boolean
}

const SearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  className,
  size = 'md',
  autoFocus = false,
  showClearButton = true,
  disabled = false,
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={classNames('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <HiOutlineSearch 
          className={classNames(
            'text-gray-400',
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          )} 
        />
      </div>
      
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        className={classNames(
          'pl-10',
          showClearButton && internalValue ? 'pr-10' : '',
          sizeClasses[size]
        )}
        size={size}
      />
      
      {showClearButton && internalValue && !disabled && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Button
            type="button"
            variant="plain"
            size="xs"
            icon={<HiOutlineX />}
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>
      )}
    </div>
  )
}

export default SearchInput