import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { analyticsDashboardData } from '@/mock/data/analyticsData'

export type KPIData = {
  revenue: {
    current: number
    previous: number
    growthRate: number
    target: number
    targetProgress: number
  }
  orders: {
    current: number
    previous: number
    growthRate: number
    target: number
    targetProgress: number
  }
  customers: {
    current: number
    previous: number
    growthRate: number
    target: number
    targetProgress: number
  }
  conversion: {
    current: number
    previous: number
    growthRate: number
    target: number
    targetProgress: number
  }
}

export type RevenueAnalytics = {
  timeframe: string
  categories: string[]
  series: {
    name: string
    data: number[]
    color: string
    type?: string
    dashArray?: number
  }[]
}

export type SalesByCategory = {
  categories: string[]
  series: {
    name: string
    data: number[]
  }[]
  colors: string[]
}

export type CustomerAcquisition = {
  timeframe: string
  categories: string[]
  series: {
    name: string
    data: number[]
    color: string
  }[]
}

export type TopProduct = {
  id: string
  name: string
  category: string
  revenue: number
  units: number
  growth: number
}

export type GeographicData = {
  region: string
  revenue: number
  customers: number
  growth: number
}[]

export type ConversionFunnel = {
  stage: string
  count: number
  percentage: number
}[]

export type AnalyticsDashboardData = {
  kpiData?: KPIData
  revenueAnalytics?: RevenueAnalytics
  salesByCategory?: SalesByCategory
  customerAcquisition?: CustomerAcquisition
  topProducts?: TopProduct[]
  geographicData?: GeographicData
  conversionFunnel?: ConversionFunnel
}

export type AnalyticsDashboardState = {
  startDate: number
  endDate: number
  loading: boolean
  dashboardData: AnalyticsDashboardData
  dateRange: 'week' | 'month' | 'quarter' | 'year'
  selectedMetrics: string[]
}

export const SLICE_NAME = 'analyticsDashboard'

export const getAnalyticsData = createAsyncThunk(
  SLICE_NAME + '/getAnalyticsData',
  async (params: { startDate: number; endDate: number }) => {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    return analyticsDashboardData
  }
)

const initialState: AnalyticsDashboardState = {
  startDate: dayjs().subtract(3, 'month').unix(),
  endDate: dayjs().unix(),
  loading: false,
  dashboardData: {},
  dateRange: 'month',
  selectedMetrics: ['revenue', 'orders', 'customers', 'conversion'],
}

const analyticsDashboardSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<number>) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action: PayloadAction<number>) => {
      state.endDate = action.payload
    },
    setDateRange: (state, action: PayloadAction<'week' | 'month' | 'quarter' | 'year'>) => {
      state.dateRange = action.payload
      // Update start date based on range
      const now = dayjs()
      switch (action.payload) {
        case 'week':
          state.startDate = now.subtract(1, 'week').unix()
          break
        case 'month':
          state.startDate = now.subtract(1, 'month').unix()
          break
        case 'quarter':
          state.startDate = now.subtract(3, 'month').unix()
          break
        case 'year':
          state.startDate = now.subtract(1, 'year').unix()
          break
      }
      state.endDate = now.unix()
    },
    setSelectedMetrics: (state, action: PayloadAction<string[]>) => {
      state.selectedMetrics = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAnalyticsData.fulfilled, (state, action) => {
        state.dashboardData = action.payload
        state.loading = false
      })
      .addCase(getAnalyticsData.pending, state => {
        state.loading = true
      })
      .addCase(getAnalyticsData.rejected, state => {
        state.loading = false
      })
  },
})

export const { setStartDate, setEndDate, setDateRange, setSelectedMetrics } = analyticsDashboardSlice.actions

export default analyticsDashboardSlice.reducer