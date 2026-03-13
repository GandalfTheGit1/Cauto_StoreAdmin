// Enhanced inventory management data

export const inventoryDashboardData = {
  statisticData: [
    {
      key: 'totalItems',
      label: 'Total Items',
      value: 1247,
      growShrink: 3.2,
    },
    {
      key: 'lowStock',
      label: 'Low Stock Items',
      value: 23,
      growShrink: -12.5,
    },
    {
      key: 'outOfStock',
      label: 'Out of Stock',
      value: 5,
      growShrink: -8.3,
    },
    {
      key: 'totalValue',
      label: 'Total Inventory Value',
      value: 485750,
      growShrink: 5.7,
    },
  ],
  topMovingItems: [
    {
      id: '12',
      name: 'Luminaire Giotto Headphones',
      sku: 'LUM-HEAD-001',
      category: 'devices',
      quantity: 46,
      movements: 127,
      trend: 'up',
    },
    {
      id: '24',
      name: 'Professional Gaming Keyboard',
      sku: 'TPR-KEY-024',
      category: 'devices',
      quantity: 75,
      movements: 89,
      trend: 'up',
    },
    {
      id: '25',
      name: 'Wireless Mouse Pro',
      sku: 'TPR-MOU-025',
      category: 'devices',
      quantity: 120,
      movements: 156,
      trend: 'up',
    },
  ],
  stockLevels: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        name: 'Stock In',
        data: [450, 520, 380, 670, 590, 720, 650, 580, 690, 750, 680, 720],
      },
      {
        name: 'Stock Out',
        data: [380, 460, 320, 580, 520, 650, 580, 520, 620, 680, 600, 650],
      },
    ],
  },
}

export const warehousesData = [
  {
    id: 'wh-001',
    name: 'Main Warehouse',
    code: 'MW-001',
    address: {
      street: '1000 Industrial Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90021',
      country: 'United States',
    },
    manager: 'John Martinez',
    capacity: 10000,
    currentUtilization: 7500,
    utilizationPercentage: 75,
    zones: [
      { id: 'zone-A', name: 'Zone A', capacity: 2500, utilization: 2100 },
      { id: 'zone-B', name: 'Zone B', capacity: 2500, utilization: 1800 },
      { id: 'zone-C', name: 'Zone C', capacity: 2500, utilization: 1900 },
      { id: 'zone-D', name: 'Zone D', capacity: 2500, utilization: 1700 },
    ],
    status: 'active',
    createdAt: new Date('2022-01-15').getTime(),
  },
  {
    id: 'wh-002',
    name: 'East Coast Distribution',
    code: 'ECD-002',
    address: {
      street: '500 Distribution Way',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      country: 'United States',
    },
    manager: 'Sarah Williams',
    capacity: 7500,
    currentUtilization: 5200,
    utilizationPercentage: 69,
    zones: [
      { id: 'zone-E', name: 'Zone E', capacity: 2500, utilization: 1800 },
      { id: 'zone-F', name: 'Zone F', capacity: 2500, utilization: 1700 },
      { id: 'zone-G', name: 'Zone G', capacity: 2500, utilization: 1700 },
    ],
    status: 'active',
    createdAt: new Date('2022-06-20').getTime(),
  },
]

export const suppliersData = [
  {
    id: 'sup-001',
    name: 'WindForce co, Ltd',
    code: 'WF-001',
    contactPerson: 'Michael Chen',
    email: 'michael.chen@windforce.com',
    phone: '+86 21 1234 5678',
    address: {
      street: '888 Technology Road',
      city: 'Shanghai',
      state: 'Shanghai',
      zipCode: '200000',
      country: 'China',
    },
    paymentTerms: 'Net 30',
    leadTime: 14,
    rating: 4.5,
    status: 'active',
    categories: ['devices', 'accessories'],
    totalOrders: 45,
    totalValue: 125000,
    createdAt: new Date('2022-03-10').getTime(),
  },
  {
    id: 'sup-002',
    name: 'Gaming Gear Ltd',
    code: 'GG-002',
    contactPerson: 'David Johnson',
    email: 'david.j@gaminggear.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '200 Gaming Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States',
    },
    paymentTerms: 'Net 15',
    leadTime: 7,
    rating: 4.8,
    status: 'active',
    categories: ['devices', 'gaming'],
    totalOrders: 32,
    totalValue: 89000,
    createdAt: new Date('2022-05-15').getTime(),
  },
  {
    id: 'sup-003',
    name: 'Luxury Goods Inc',
    code: 'LG-003',
    contactPerson: 'Isabella Rodriguez',
    email: 'isabella@luxurygoods.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '150 Fashion Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    paymentTerms: 'Net 45',
    leadTime: 21,
    rating: 4.3,
    status: 'active',
    categories: ['accessories', 'luxury'],
    totalOrders: 18,
    totalValue: 67000,
    createdAt: new Date('2022-08-22').getTime(),
  },
]

export const inventoryMovementsData = [
  {
    id: 'mov-001',
    productId: '12',
    productName: 'Luminaire Giotto Headphones',
    sku: 'LUM-HEAD-001',
    type: 'inbound',
    quantity: 50,
    unitCost: 180,
    totalCost: 9000,
    warehouseId: 'wh-001',
    location: 'A-1-001',
    supplierId: 'sup-001',
    reference: 'PO-2024-001',
    reason: 'Purchase Order',
    date: new Date('2024-10-15').getTime(),
    processedBy: 'John Martinez',
    notes: 'Regular stock replenishment',
  },
  {
    id: 'mov-002',
    productId: '12',
    productName: 'Luminaire Giotto Headphones',
    sku: 'LUM-HEAD-001',
    type: 'outbound',
    quantity: -4,
    unitCost: 180,
    totalCost: -720,
    warehouseId: 'wh-001',
    location: 'A-1-001',
    reference: 'SO-2024-045',
    reason: 'Sales Order',
    date: new Date('2024-10-20').getTime(),
    processedBy: 'Maria Garcia',
    notes: 'Customer order fulfillment',
  },
  {
    id: 'mov-003',
    productId: '24',
    productName: 'Professional Gaming Keyboard',
    sku: 'TPR-KEY-024',
    type: 'inbound',
    quantity: 100,
    unitCost: 120,
    totalCost: 12000,
    warehouseId: 'wh-001',
    location: 'B-2-015',
    supplierId: 'sup-002',
    reference: 'PO-2024-015',
    reason: 'Purchase Order',
    date: new Date('2024-10-28').getTime(),
    processedBy: 'John Martinez',
    notes: 'New product launch inventory',
  },
  {
    id: 'mov-004',
    productId: '24',
    productName: 'Professional Gaming Keyboard',
    sku: 'TPR-KEY-024',
    type: 'outbound',
    quantity: -25,
    unitCost: 120,
    totalCost: -3000,
    warehouseId: 'wh-001',
    location: 'B-2-015',
    reference: 'SO-2024-067',
    reason: 'Sales Order',
    date: new Date('2024-10-30').getTime(),
    processedBy: 'Sarah Williams',
    notes: 'Bulk order for corporate client',
  },
  {
    id: 'mov-005',
    productId: '25',
    productName: 'Wireless Mouse Pro',
    sku: 'TPR-MOU-025',
    type: 'adjustment',
    quantity: -2,
    unitCost: 45,
    totalCost: -90,
    warehouseId: 'wh-001',
    location: 'B-2-020',
    reference: 'ADJ-2024-003',
    reason: 'Damaged Goods',
    date: new Date('2024-11-01').getTime(),
    processedBy: 'Mike Thompson',
    notes: 'Damaged during handling - written off',
  },
]

export const stockAlertsData = [
  {
    id: 'alert-001',
    productId: '16',
    productName: 'Blue Backpack',
    sku: 'BIS-016',
    type: 'out_of_stock',
    currentStock: 0,
    reorderLevel: 10,
    severity: 'critical',
    createdAt: new Date('2024-10-25').getTime(),
    acknowledged: false,
  },
  {
    id: 'alert-002',
    productId: '19',
    productName: 'Beats Solo Headphone',
    sku: 'BIS-019',
    type: 'out_of_stock',
    currentStock: 0,
    reorderLevel: 15,
    severity: 'critical',
    createdAt: new Date('2024-10-28').getTime(),
    acknowledged: false,
  },
  {
    id: 'alert-003',
    productId: '18',
    productName: 'Strip Analog Watch',
    sku: 'BIS-018',
    type: 'low_stock',
    currentStock: 7,
    reorderLevel: 15,
    severity: 'warning',
    createdAt: new Date('2024-11-01').getTime(),
    acknowledged: true,
  },
  {
    id: 'alert-004',
    productId: '21',
    productName: 'Bronze Analog Watch',
    sku: 'BIS-021',
    type: 'low_stock',
    currentStock: 6,
    reorderLevel: 12,
    severity: 'warning',
    createdAt: new Date('2024-11-02').getTime(),
    acknowledged: false,
  },
]

export const purchaseOrdersData = [
  {
    id: 'PO-2024-001',
    supplierId: 'sup-001',
    supplierName: 'WindForce co, Ltd',
    status: 'received',
    orderDate: new Date('2024-10-01').getTime(),
    expectedDate: new Date('2024-10-15').getTime(),
    receivedDate: new Date('2024-10-15').getTime(),
    totalAmount: 15000,
    currency: 'USD',
    items: [
      {
        productId: '12',
        productName: 'Luminaire Giotto Headphones',
        sku: 'LUM-HEAD-001',
        quantity: 50,
        unitCost: 180,
        totalCost: 9000,
      },
      {
        productId: '13',
        productName: 'White Backpack',
        sku: 'BIS-013',
        quantity: 40,
        unitCost: 95,
        totalCost: 3800,
      },
    ],
    createdBy: 'Sarah Johnson',
    approvedBy: 'Mike Rodriguez',
    notes: 'Regular quarterly stock replenishment',
  },
  {
    id: 'PO-2024-015',
    supplierId: 'sup-002',
    supplierName: 'Gaming Gear Ltd',
    status: 'received',
    orderDate: new Date('2024-10-20').getTime(),
    expectedDate: new Date('2024-10-28').getTime(),
    receivedDate: new Date('2024-10-28').getTime(),
    totalAmount: 18500,
    currency: 'USD',
    items: [
      {
        productId: '24',
        productName: 'Professional Gaming Keyboard',
        sku: 'TPR-KEY-024',
        quantity: 100,
        unitCost: 120,
        totalCost: 12000,
      },
      {
        productId: '25',
        productName: 'Wireless Mouse Pro',
        sku: 'TPR-MOU-025',
        quantity: 150,
        unitCost: 45,
        totalCost: 6750,
      },
    ],
    createdBy: 'John Martinez',
    approvedBy: 'Sarah Johnson',
    notes: 'New product launch preparation',
  },
  {
    id: 'PO-2024-023',
    supplierId: 'sup-003',
    supplierName: 'Luxury Goods Inc',
    status: 'pending',
    orderDate: new Date('2024-11-01').getTime(),
    expectedDate: new Date('2024-11-22').getTime(),
    receivedDate: null,
    totalAmount: 8500,
    currency: 'USD',
    items: [
      {
        productId: '26',
        productName: 'Premium Leather Wallet',
        sku: 'LC-WAL-026',
        quantity: 60,
        unitCost: 75,
        totalCost: 4500,
      },
    ],
    createdBy: 'Jennifer Lee',
    approvedBy: 'Mike Rodriguez',
    notes: 'Holiday season inventory preparation',
  },
]

export const inventoryAnalyticsData = {
  stockLevels: {
    categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
    series: [
      {
        name: 'In Stock',
        data: [245, 189, 156, 203, 178]
      },
      {
        name: 'Low Stock',
        data: [23, 34, 12, 28, 19]
      },
      {
        name: 'Out of Stock',
        data: [5, 8, 3, 7, 4]
      }
    ]
  },
  inventoryTurnover: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    series: [
      {
        name: 'Turnover Rate',
        data: [4.2, 4.5, 3.8, 4.1, 4.7, 5.2, 4.9, 5.1, 4.6, 4.3, 4.8]
      }
    ]
  },
  categoryDistribution: {
    labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
    series: [273, 231, 171, 238, 201]
  },
  topMovingItems: [
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      currentStock: 45,
      sold: 156,
      turnoverRate: 8.2
    },
    {
      id: '2',
      name: 'Running Shoes',
      category: 'Sports',
      currentStock: 23,
      sold: 89,
      turnoverRate: 7.1
    },
    {
      id: '3',
      name: 'Cotton T-Shirt',
      category: 'Clothing',
      currentStock: 67,
      sold: 234,
      turnoverRate: 6.8
    }
  ]
}

export const inventoryKPIData = {
  totalItems: {
    value: 1247,
    growShrink: 3.2
  },
  lowStock: {
    value: 23,
    growShrink: -12.5
  },
  outOfStock: {
    value: 5,
    growShrink: -8.3
  },
  totalValue: {
    value: 485750,
    growShrink: 5.7
  },
  turnoverRate: {
    value: 4.8,
    growShrink: 12.1
  },
  reorderAlerts: {
    value: 8,
    growShrink: -15.2
  }
}