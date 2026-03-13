// Enhanced analytics and dashboard data

export const analyticsDashboardData = {
  kpiData: {
    revenue: {
      current: 125847.50,
      previous: 112350.25,
      growthRate: 12.0,
      target: 130000,
      targetProgress: 96.8,
    },
    orders: {
      current: 1847,
      previous: 1623,
      growthRate: 13.8,
      target: 2000,
      targetProgress: 92.4,
    },
    customers: {
      current: 2456,
      previous: 2234,
      growthRate: 9.9,
      target: 2500,
      targetProgress: 98.2,
    },
    conversion: {
      current: 3.2,
      previous: 2.8,
      growthRate: 14.3,
      target: 3.5,
      targetProgress: 91.4,
    },
  },
  revenueAnalytics: {
    timeframe: 'monthly',
    categories: [
      'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
      'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024'
    ],
    series: [
      {
        name: 'Revenue',
        data: [85000, 92000, 88000, 105000, 98000, 115000, 108000, 122000, 118000, 125000, 125847],
        color: '#3B82F6',
      },
      {
        name: 'Target',
        data: [90000, 95000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 130000],
        color: '#EF4444',
        type: 'line',
        dashArray: 5,
      },
    ],
  },
  salesByCategory: {
    categories: ['Devices', 'Watches', 'Bags', 'Accessories', 'Clothing'],
    series: [
      {
        name: 'Sales',
        data: [45230, 28450, 18750, 15680, 12340],
      },
    ],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  },
  customerAcquisition: {
    timeframe: 'weekly',
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    series: [
      {
        name: 'New Customers',
        data: [45, 52, 38, 67, 59, 72, 65, 58],
        color: '#10B981',
      },
      {
        name: 'Returning Customers',
        data: [123, 145, 132, 156, 148, 167, 159, 162],
        color: '#3B82F6',
      },
    ],
  },
  topProducts: [
    {
      id: '12',
      name: 'Luminaire Giotto Headphones',
      category: 'Devices',
      revenue: 15840,
      units: 63,
      growth: 12.5,
    },
    {
      id: '24',
      name: 'Professional Gaming Keyboard',
      category: 'Devices',
      revenue: 14175,
      units: 75,
      growth: 18.3,
    },
    {
      id: '25',
      name: 'Wireless Mouse Pro',
      category: 'Devices',
      revenue: 9480,
      units: 120,
      growth: 8.7,
    },
    {
      id: '23',
      name: 'Antique Analog Watch',
      category: 'Watches',
      revenue: 8985,
      units: 15,
      growth: 22.1,
    },
    {
      id: '27',
      name: 'Fitness Tracker Band',
      category: 'Devices',
      revenue: 7960,
      units: 40,
      growth: 15.6,
    },
  ],
  customerSegments: {
    labels: ['Enterprise', 'SMB', 'Individual', 'Reseller'],
    series: [
      {
        name: 'Revenue Share',
        data: [45.2, 28.7, 18.9, 7.2],
      },
    ],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
  },
  geographicData: [
    { region: 'North America', revenue: 67500, customers: 1245, growth: 8.5 },
    { region: 'Europe', revenue: 32400, customers: 687, growth: 12.3 },
    { region: 'Asia Pacific', revenue: 18900, customers: 423, growth: 22.7 },
    { region: 'Latin America', revenue: 5200, customers: 89, growth: 15.1 },
    { region: 'Middle East & Africa', revenue: 1847, customers: 12, growth: 5.8 },
  ],
  conversionFunnel: [
    { stage: 'Visitors', count: 125000, percentage: 100 },
    { stage: 'Leads', count: 8750, percentage: 7.0 },
    { stage: 'Qualified Leads', count: 3500, percentage: 2.8 },
    { stage: 'Opportunities', count: 1750, percentage: 1.4 },
    { stage: 'Customers', count: 560, percentage: 0.45 },
  ],
  cohortAnalysis: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    cohorts: [
      {
        cohort: 'Jan 2024',
        data: [100, 85, 72, 65, 58, 52, 48, 45, 42, 40, 38],
      },
      {
        cohort: 'Feb 2024',
        data: [100, 88, 75, 68, 61, 55, 51, 48, 45, 43],
      },
      {
        cohort: 'Mar 2024',
        data: [100, 82, 70, 63, 57, 52, 49, 46, 44],
      },
      {
        cohort: 'Apr 2024',
        data: [100, 90, 78, 71, 64, 59, 55, 52],
      },
      {
        cohort: 'May 2024',
        data: [100, 87, 74, 67, 61, 56, 53],
      },
      {
        cohort: 'Jun 2024',
        data: [100, 85, 73, 66, 60, 55],
      },
      {
        cohort: 'Jul 2024',
        data: [100, 89, 76, 69, 63],
      },
      {
        cohort: 'Aug 2024',
        data: [100, 86, 74, 68],
      },
      {
        cohort: 'Sep 2024',
        data: [100, 88, 76],
      },
      {
        cohort: 'Oct 2024',
        data: [100, 84],
      },
      {
        cohort: 'Nov 2024',
        data: [100],
      },
    ],
  },
}

export const performanceMetrics = {
  websiteTraffic: {
    timeframe: 'daily',
    categories: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    series: [
      {
        name: 'Page Views',
        data: [2340, 2567, 2123, 2890, 3456, 3234, 2987, 3567, 3890, 3456, 3234, 3567, 3890, 4123, 3987, 4234, 4567, 4123, 3987, 4234, 4567, 4890, 5123, 4987, 5234, 5567, 5123, 4987, 5234, 5567],
        color: '#3B82F6',
      },
      {
        name: 'Unique Visitors',
        data: [1890, 2123, 1756, 2234, 2567, 2345, 2123, 2678, 2890, 2567, 2345, 2678, 2890, 3123, 2987, 3234, 3456, 3123, 2987, 3234, 3456, 3678, 3890, 3567, 3789, 4012, 3890, 3567, 3789, 4012],
        color: '#10B981',
      },
    ],
  },
  salesPerformance: {
    teams: [
      {
        name: 'Sarah Johnson',
        role: 'Senior Sales Rep',
        target: 50000,
        achieved: 47500,
        percentage: 95.0,
        deals: 23,
        avgDealSize: 2065,
      },
      {
        name: 'Mike Rodriguez',
        role: 'Sales Rep',
        target: 40000,
        achieved: 42300,
        percentage: 105.8,
        deals: 19,
        avgDealSize: 2226,
      },
      {
        name: 'Jennifer Lee',
        role: 'Sales Rep',
        target: 35000,
        achieved: 31200,
        percentage: 89.1,
        deals: 15,
        avgDealSize: 2080,
      },
      {
        name: 'Tom Wilson',
        role: 'Junior Sales Rep',
        target: 25000,
        achieved: 28900,
        percentage: 115.6,
        deals: 12,
        avgDealSize: 2408,
      },
    ],
  },
  customerSatisfaction: {
    nps: {
      score: 67,
      promoters: 45,
      passives: 32,
      detractors: 23,
      responses: 100,
    },
    ratings: {
      average: 4.3,
      distribution: [
        { stars: 5, count: 234, percentage: 58.5 },
        { stars: 4, count: 89, percentage: 22.3 },
        { stars: 3, count: 45, percentage: 11.3 },
        { stars: 2, count: 23, percentage: 5.8 },
        { stars: 1, count: 9, percentage: 2.3 },
      ],
    },
  },
}

export const forecastData = {
  revenueForecast: {
    timeframe: 'monthly',
    categories: ['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'],
    series: [
      {
        name: 'Actual',
        data: [125847, null, null, null, null, null],
        color: '#3B82F6',
      },
      {
        name: 'Forecast',
        data: [null, 132000, 138500, 145200, 152100, 159300],
        color: '#10B981',
        dashArray: 5,
      },
      {
        name: 'Conservative',
        data: [null, 128000, 134000, 140500, 147200, 154100],
        color: '#F59E0B',
        dashArray: 3,
      },
      {
        name: 'Optimistic',
        data: [null, 136000, 143000, 150000, 157500, 165000],
        color: '#EF4444',
        dashArray: 3,
      },
    ],
  },
  demandForecast: [
    {
      productId: '12',
      productName: 'Luminaire Giotto Headphones',
      currentStock: 46,
      forecastedDemand: 85,
      recommendedOrder: 60,
      confidence: 87,
    },
    {
      productId: '24',
      productName: 'Professional Gaming Keyboard',
      currentStock: 75,
      forecastedDemand: 120,
      recommendedOrder: 80,
      confidence: 92,
    },
    {
      productId: '25',
      productName: 'Wireless Mouse Pro',
      currentStock: 120,
      forecastedDemand: 95,
      recommendedOrder: 0,
      confidence: 78,
    },
  ],
}