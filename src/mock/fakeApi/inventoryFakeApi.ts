import type { Server } from 'miragejs'
import paginate from '@/utils/paginate'
import sortBy, { Primer } from '@/utils/sortBy'
import wildCardSearch from '@/utils/wildCardSearch'

export default function inventoryFakeApi(server: Server, apiPrefix: string) {
  // Dashboard endpoint
  server.post(`${apiPrefix}/inventory/dashboard`, schema => {
    return schema.db.inventoryDashboardData[0]
  })

  // Inventory items endpoints
  server.post(`${apiPrefix}/inventory/items`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const items = schema.db.inventoryData
    const sanitizeItems = items.filter(elm => typeof elm !== 'function')
    let data = sanitizeItems
    let total = items.length

    if ((key === 'productId' || key === 'warehouseLocation') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/inventory/item`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const item = schema.db.inventoryData.find(id)
    return item
  })

  server.post(`${apiPrefix}/inventory/items/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.inventoryData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/inventory/items/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.inventoryData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/inventory/items/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.inventoryData.remove({ id })
    return true
  })

  // Warehouses endpoints
  server.get(`${apiPrefix}/inventory/warehouses`, (schema) => {
    return schema.db.warehousesData
  })

  server.get(`${apiPrefix}/inventory/warehouse`, (schema, { queryParams }) => {
    const id = queryParams.id
    const warehouse = schema.db.warehousesData.find(id)
    return warehouse
  })

  server.post(`${apiPrefix}/inventory/warehouses/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.warehousesData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/inventory/warehouses/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.warehousesData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/inventory/warehouses/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.warehousesData.remove({ id })
    return true
  })

  // Suppliers endpoints
  server.post(`${apiPrefix}/inventory/suppliers`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const suppliers = schema.db.suppliersData
    const sanitizeSuppliers = suppliers.filter(elm => typeof elm !== 'function')
    let data = sanitizeSuppliers
    let total = suppliers.length

    if ((key === 'name' || key === 'contactPerson' || key === 'email') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/inventory/supplier`, (schema, { queryParams }) => {
    const id = queryParams.id
    const supplier = schema.db.suppliersData.find(id)
    return supplier
  })

  server.post(`${apiPrefix}/inventory/suppliers/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.suppliersData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/inventory/suppliers/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.suppliersData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/inventory/suppliers/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.suppliersData.remove({ id })
    return true
  })

  // Inventory movements endpoints
  server.post(`${apiPrefix}/inventory/movements`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const movements = schema.db.inventoryMovementsData
    const sanitizeMovements = movements.filter(elm => typeof elm !== 'function')
    let data = sanitizeMovements
    let total = movements.length

    if ((key === 'productName' || key === 'type' || key === 'reason') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.post(`${apiPrefix}/inventory/movements/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.inventoryMovementsData.insert(data)
    return true
  })

  // Stock alerts endpoints
  server.get(`${apiPrefix}/inventory/alerts`, (schema) => {
    return schema.db.stockAlertsData
  })

  server.put(`${apiPrefix}/inventory/alerts/acknowledge`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.stockAlertsData.update({ id }, { acknowledged: true })
    return true
  })

  // Purchase orders endpoints
  server.post(`${apiPrefix}/inventory/purchase-orders`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const orders = schema.db.purchaseOrdersData
    const sanitizeOrders = orders.filter(elm => typeof elm !== 'function')
    let data = sanitizeOrders
    let total = orders.length

    if ((key === 'id' || key === 'supplierName' || key === 'status') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/inventory/purchase-order`, (schema, { queryParams }) => {
    const id = queryParams.id
    const order = schema.db.purchaseOrdersData.find(id)
    return order
  })

  server.post(`${apiPrefix}/inventory/purchase-orders/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.purchaseOrdersData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/inventory/purchase-orders/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.purchaseOrdersData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/inventory/purchase-orders/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.purchaseOrdersData.remove({ id })
    return true
  })
}