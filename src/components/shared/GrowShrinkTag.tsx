import classNames from 'classnames'
import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'

import Tag from '@/components/ui/Tag'
import growShrinkColor from '@/utils/growShrinkColor'

type GrowShrinkTagProps = {
  value?: number
  showIcon?: boolean
  prefix?: ReactNode | string
  suffix?: ReactNode | string
  className?: string
}

const GrowShrinkTag = forwardRef<HTMLDivElement, GrowShrinkTagProps>(
  (props, ref) => {
    const { value = 0, className, prefix, suffix, showIcon = true } = props

    return (
      <Tag
        ref={ref}
        className={classNames(
          'gap-1 font-bold border-0',
          growShrinkColor(value, 'text'),
          growShrinkColor(value, 'bg'),
          className
        )}
      >
        {value !== 0 && (
          <span>
            {showIcon && (value > 0 ? <HiArrowUp /> : <HiArrowDown />)}
          </span>
        )}
        <span>
          {prefix}
          {value}
          {suffix}
        </span>
      </Tag>
    )
  }
)

GrowShrinkTag.displayName = 'GrowShrinkTag'

export default GrowShrinkTag
