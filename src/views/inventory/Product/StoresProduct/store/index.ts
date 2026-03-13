import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { RootState } from '@/store'

import reducers, { SLICE_NAME, SalesProductListState } from './productListSlice'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: SalesProductListState
    }
  }
> = useSelector

export * from './productListSlice'
export { useAppDispatch } from '@/store'
export default reducer
