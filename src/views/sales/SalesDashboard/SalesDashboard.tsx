import { injectReducer } from '@/store'

import SalesDashboardBody from './components/SalesDashboardBody'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import reducer from './store'

injectReducer('salesDashboard', reducer)

const SalesDashboard = () => {
  return (
    <div className='flex flex-col gap-4 h-full'>
      <SalesDashboardHeader />
      <SalesDashboardBody />
    </div>
  )
}

export default SalesDashboard
