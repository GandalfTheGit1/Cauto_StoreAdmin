import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { CommonProps } from '@/@types/common'
import type { NavigationTree } from '@/@types/navigation'
import type { Direction } from '@/@types/theme'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import Menu from '@/components/ui/Menu'
import Tooltip from '@/components/ui/Tooltip'

import VerticalMenuIcon from './VerticalMenuIcon'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
  title: string
  translateKey: string
  direction?: Direction
}

interface DefaultItemProps {
  nav: NavigationTree
  onLinkClick?: (link: { key: string; title: string; path: string }) => void
  sideCollapsed?: boolean
  userAuthority: string[]
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({
  title,
  translateKey,
  children,
  direction,
}: CollapsedItemProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t(translateKey) || title}
      placement={direction === 'rtl' ? 'left' : 'right'}
    >
      {children}
    </Tooltip>
  )
}

const DefaultItem = (props: DefaultItemProps) => {
  const { nav, onLinkClick, sideCollapsed, userAuthority } = props

  // Add tour data attributes for key navigation items
  const getTourDataAttribute = (navKey: string) => {
    const tourMap: Record<string, string> = {
      'sales': 'sales-nav',
      'inventory': 'inventory-nav', 
      'crm': 'crm-nav',
      'analytics': 'analytics-nav'
    }
    return tourMap[navKey] ? { 'data-tour': tourMap[navKey] } : {}
  }

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuItem key={nav.key} eventKey={nav.key} className='mb-2'>
        <Link
          to={nav.path}
          className='flex items-center h-full w-full'
          onClick={() =>
            onLinkClick?.({
              key: nav.key,
              title: nav.title,
              path: nav.path,
            })
          }
          target={nav.isExternalLink ? '_blank' : ''}
          {...getTourDataAttribute(nav.key)}
        >
          <VerticalMenuIcon icon={nav.icon} />
          {!sideCollapsed && (
            <span>
              <Trans i18nKey={nav.translateKey} defaults={nav.title} />
            </span>
          )}
        </Link>
      </MenuItem>
    </AuthorityCheck>
  )
}

const VerticalSingleMenuItem = ({
  nav,
  onLinkClick,
  sideCollapsed,
  userAuthority,
  direction,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      {sideCollapsed ? (
        <CollapsedItem
          title={nav.title}
          translateKey={nav.translateKey}
          direction={direction}
        >
          <DefaultItem
            nav={nav}
            sideCollapsed={sideCollapsed}
            userAuthority={userAuthority}
            onLinkClick={onLinkClick}
          />
        </CollapsedItem>
      ) : (
        <DefaultItem
          nav={nav}
          sideCollapsed={sideCollapsed}
          userAuthority={userAuthority}
          onLinkClick={onLinkClick}
        />
      )}
    </AuthorityCheck>
  )
}

export default VerticalSingleMenuItem
