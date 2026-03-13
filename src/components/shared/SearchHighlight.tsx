import Highlighter from 'react-highlight-words'
import classNames from 'classnames'
import useThemeClass from '@/utils/hooks/useThemeClass'

export interface SearchHighlightProps {
  text: string
  searchWords: string[]
  className?: string
  highlightClassName?: string
  caseSensitive?: boolean
  autoEscape?: boolean
}

const SearchHighlight = ({
  text,
  searchWords,
  className,
  highlightClassName,
  caseSensitive = false,
  autoEscape = true,
}: SearchHighlightProps) => {
  const { textTheme } = useThemeClass()

  const defaultHighlightClassName = classNames(
    'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 font-semibold rounded px-1',
    textTheme
  )

  return (
    <Highlighter
      highlightClassName={highlightClassName || defaultHighlightClassName}
      searchWords={searchWords.filter(word => word.trim().length > 0)}
      autoEscape={autoEscape}
      caseSensitive={caseSensitive}
      textToHighlight={text || ''}
      className={className}
    />
  )
}

export default SearchHighlight