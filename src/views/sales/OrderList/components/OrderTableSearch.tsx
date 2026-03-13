import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

import type { TableQueries } from '@/@types/common'
import Input from '@/components/ui/Input'

import {
  getOrders,
  setTableData,
  useAppDispatch,
  useAppSelector,
} from '../store'

const OrderTableSearch = () => {
  const dispatch = useAppDispatch()

  const searchInput = useRef<HTMLInputElement>(null)

  const tableData = useAppSelector(state => state.salesOrderList.data.tableData)

  const debounceFn = debounce(handleDebounceFn, 500)

  function handleDebounceFn(val: string) {
    const newTableData = cloneDeep(tableData)
    newTableData.query = val
    newTableData.pageIndex = 1
    if (typeof val === 'string' && val.length > 1) {
      fetchData(newTableData)
    }

    if (typeof val === 'string' && val.length === 0) {
      fetchData(newTableData)
    }
  }

  const fetchData = (data: TableQueries) => {
    dispatch(setTableData(data))
    dispatch(getOrders(data))
  }

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    debounceFn(e.target.value)
  }

  return (
    <Input
      ref={searchInput}
      className='lg:w-52'
      size='sm'
      placeholder='Search'
      prefix={<HiOutlineSearch className='text-lg' />}
      onChange={onEdit}
    />
  )
}

export default OrderTableSearch
