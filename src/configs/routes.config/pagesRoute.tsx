import { lazy } from 'react'

import type { Routes } from '@/@types/routes'
import { ADMIN, OWNER, SELLER_FIXED, USER } from '@/constants/roles.constant'
import { PAGES_PREFIX_PATH } from '@/constants/route.constant'

const pagesRoute: Routes = [
  {
    key: 'pages.welcome',
    path: `${PAGES_PREFIX_PATH}/welcome/:subscriptionId`,
    component: lazy(() => import('@/views/pages/Welcome')),
    authority: [ADMIN, OWNER],
    meta: {
      layout: 'blank',
      pageContainerType: 'gutterless',
      footer: false,
    },
  },
  {
    key: 'pages.accessDenied',
    path: '/access-denied',
    component: lazy(() => import('@/views/pages/AccessDenied')),
    authority: [ADMIN, SELLER_FIXED, OWNER],
  },
]

export default pagesRoute
