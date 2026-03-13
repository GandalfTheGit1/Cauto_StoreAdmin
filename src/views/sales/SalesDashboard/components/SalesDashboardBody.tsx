import { useEffect, useState } from 'react'

import Loading from '@/components/shared/Loading'
import { useAppDispatch } from '@/store'

import { getSalesDashboardData, useAppSelector } from '../store'

import LatestOrder from './LatestOrder'
import SalesByCategories from './SalesByCategories'
import SalesReport from './SalesReport'
import Statistic from './Statistic'
import EnhancedStatistic from './EnhancedStatistic'
import TopProduct from './TopProduct'

const SalesDashboardBody = () => {
  const dispatch = useAppDispatch()

  const { shopId } = useAppSelector(state => state.auth.user)
  const { dashboardData, startDate, endDate } = useAppSelector(
    state => state.salesDashboard.data
  )

  //const loading = useAppSelector((state) => state.salesDashboard.data.loading);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])

  const fetchData = () => {
    dispatch(getSalesDashboardData({ startDate, endDate, shopId })).then(() =>
      setLoading(false)
    )
  }

  // Enhanced statistics data with additional KPIs
  const enhancedStats = dashboardData?.statisticData ? {
    revenue: dashboardData.statisticData.revenue,
    orders: dashboardData.statisticData.orders,
    purchases: dashboardData.statisticData.purchases,
    customers: {
      value: 2456,
      growShrink: 9.9
    },
    conversion: {
      value: 3.2,
      growShrink: 14.3
    },
    aov: {
      value: 185.50,
      growShrink: 7.8
    }
  } : undefined

  return (
    <Loading loading={loading}>
      <EnhancedStatistic data={enhancedStats} />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <SalesReport
          data={dashboardData?.salesReportData}
          className='col-span-2'
        />
        <SalesByCategories data={dashboardData?.salesByCategoriesData} />
      </div>
      <SalesByCategories data={dashboardData?.supplyCostReportData} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* <LatestOrder
          data={dashboardData?.latestOrderData}
          className="lg:col-span-2"
        /> */}
        <TopProduct data={dashboardData?.topProductsData} />
      </div>
    </Loading>
  )
}

export default SalesDashboardBody
