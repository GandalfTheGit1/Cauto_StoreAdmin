import { Order } from '@/@types/orders'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { injectReducer } from '@/store'

import OrdersTable from './components/NewTable'
import OrderDeleteConfirmation from './components/OrderDeleteConfirmation'
import OrdersTableTools from './components/OrdersTableTools'
import reducer from './store'

injectReducer('salesOrderList', reducer)

const OrderList = () => {
  return (
    <AdaptableCard className='h-full' bodyClass='h-full'>
      <div className='lg:flex items-center justify-between mb-4'>
        <h3 className='mb-4 lg:mb-0'>Orders</h3>
        <OrdersTableTools />
      </div>
      {/* <OrdersTable /> */}
      <OrdersTable />
      <OrderDeleteConfirmation />
    </AdaptableCard>
  )
}

export default OrderList
