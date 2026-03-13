import type { Server } from 'miragejs'

import paginate from '@/utils/paginate'
import sortBy, { Primer } from '@/utils/sortBy'
import wildCardSearch from '@/utils/wildCardSearch'

export default function salesFakeApi(server: Server, apiPrefix: string) {
  server.post(`${apiPrefix}/sales/dashboard`, schema => {
    return schema.db.salesDashboardData[0]
  })

  server.post(`${apiPrefix}/sales/products`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query, filterData } = body
    const { order, key } = sort
    const products = schema.db.productsData
    const sanitizeProducts = products.filter(elm => typeof elm !== 'function')
    let data = sanitizeProducts
    let total = products.length

    // Apply filters
    if (filterData) {
      if (filterData.category && filterData.category.length > 0) {
        data = data.filter(product => filterData.category.includes(product.category))
      }
      if (filterData.status && filterData.status.length > 0) {
        data = data.filter(product => filterData.status.includes(product.status))
      }
      if (filterData.brand && filterData.brand.length > 0) {
        data = data.filter(product => filterData.brand.includes(product.brand))
      }
    }

    if ((key === 'category' || key === 'name' || key === 'brand') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query, ['name', 'productCode', 'brand', 'category'])
      total = data.length
    }

    total = data.length
    data = paginate(data, pageSize, pageIndex)

    const responseData = {
      data: data,
      total: total,
    }
    return responseData
  })

  server.del(
    `${apiPrefix}/sales/products/delete`,
    (schema, { requestBody }) => {
      const { id } = JSON.parse(requestBody)
      schema.db.productsData.remove({ id })
      return true
    }
  )

  server.get(`${apiPrefix}/sales/product`, (schema, { queryParams }) => {
    const id = queryParams.id
    const product = schema.db.productsData.find(id)
    return product
  })

  server.put(
    `${apiPrefix}/sales/products/update`,
    (schema, { requestBody }) => {
      const data = JSON.parse(requestBody)
      const { id } = data
      const updatedProduct = {
        ...data,
        updatedAt: new Date().getTime(),
      }
      schema.db.productsData.update({ id }, updatedProduct)
      return { success: true, data: updatedProduct }
    }
  )

  server.post(
    `${apiPrefix}/sales/products/create`,
    (schema, { requestBody }) => {
      const data = JSON.parse(requestBody)
      // Generate new ID
      const newId = String(Math.max(...schema.db.productsData.map(p => parseInt(p.id))) + 1)
      const newProduct = {
        ...data,
        id: newId,
        productCode: `BIS-${newId.padStart(3, '0')}`,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        imgList: data.imgList || [{ id: `${newId}-img-0`, name: 'image-1', img: data.img || '/img/products/product-1.jpg' }],
        rating: 0,
        reviewCount: 0,
      }
      schema.db.productsData.insert(newProduct)
      return { success: true, data: newProduct }
    }
  )

  server.get(`${apiPrefix}/sales/orders`, (schema, { queryParams }) => {
    const { pageIndex, pageSize, query, filterData } = queryParams
    const order = queryParams['sort[order]']
    const key = queryParams['sort[key]']
    const orders = schema.db.enhancedOrdersData || schema.db.ordersData
    const sanitizeOrders = orders.filter(elm => typeof elm !== 'function')
    let data = sanitizeOrders
    let total = orders.length

    // Apply filters
    if (filterData) {
      const filters = typeof filterData === 'string' ? JSON.parse(filterData) : filterData
      if (filters.status && filters.status.length > 0) {
        data = data.filter(order => filters.status.includes(order.status))
      }
      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        data = data.filter(order => filters.paymentMethod.includes(order.paymentMethod || order.paymentMehod))
      }
    }

    if (key) {
      if (
        (key === 'date' || key === 'status' || key === 'paymentMethod' || key === 'totalAmount') &&
        order
      ) {
        data.sort(sortBy(key, order === 'desc', parseInt as Primer))
      } else {
        data.sort(
          sortBy(key, order === 'desc', a => (a as string).toUpperCase())
        )
      }
    }

    if (query) {
      data = wildCardSearch(data, query, ['id', 'customer', 'paymentIdentifier'])
      total = data.length
    }

    total = data.length
    data = paginate(data, parseInt(pageSize), parseInt(pageIndex))

    const responseData = {
      data: data,
      total: total,
    }
    return responseData
  })

  server.del(`${apiPrefix}/sales/orders/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    id.forEach((elm: string) => {
      schema.db.ordersData.remove({ id: elm })
    })
    return true
  })

  server.get(`${apiPrefix}/sales/orders-details`, (schema, { queryParams }) => {
    const { id } = queryParams
    const orderDetail = schema.db.orderDetailsData
    orderDetail[0].id = id
    return orderDetail[0]
  })

  // Enhanced order CRUD operations
  server.post(`${apiPrefix}/sales/orders/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    // Generate new ID
    const newId = String(Math.max(...schema.db.enhancedOrdersData.map(o => parseInt(o.id))) + 1)
    const newOrder = {
      ...data,
      id: newId,
      date: Math.floor(Date.now() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    }
    schema.db.enhancedOrdersData.insert(newOrder)
    return { success: true, data: newOrder }
  })

  server.put(`${apiPrefix}/sales/orders/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    const updatedOrder = {
      ...data,
      updatedAt: Math.floor(Date.now() / 1000),
    }
    schema.db.enhancedOrdersData.update({ id }, updatedOrder)
    return { success: true, data: updatedOrder }
  })

  server.put(`${apiPrefix}/sales/orders/status`, (schema, { requestBody }) => {
    const { id, status } = JSON.parse(requestBody)
    const order = schema.db.enhancedOrdersData.find(id)
    if (order) {
      schema.db.enhancedOrdersData.update({ id }, { 
        ...order, 
        status, 
        updatedAt: Math.floor(Date.now() / 1000) 
      })
      return { success: true }
    }
    return { success: false, message: 'Order not found' }
  })

  server.get(`${apiPrefix}/sales/order`, (schema, { queryParams }) => {
    const id = queryParams.id
    const order = schema.db.enhancedOrdersData.find(id)
    return order
  })

  // Customer endpoints
  server.post(`${apiPrefix}/sales/customers`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const customers = schema.db.customersData
    const sanitizeCustomers = customers.filter(elm => typeof elm !== 'function')
    let data = sanitizeCustomers
    let total = customers.length

    if ((key === 'firstName' || key === 'lastName' || key === 'email') && order) {
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

  server.get(`${apiPrefix}/sales/customer`, (schema, { queryParams }) => {
    const id = queryParams.id
    const customer = schema.db.customersData.find(id)
    return customer
  })

  server.post(`${apiPrefix}/sales/customers/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.customersData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/sales/customers/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.customersData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/sales/customers/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.customersData.remove({ id })
    return true
  })

  // Categories endpoints
  server.get(`${apiPrefix}/sales/categories`, (schema) => {
    return schema.db.categoriesData
  })

  server.post(`${apiPrefix}/sales/categories/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.categoriesData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/sales/categories/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.categoriesData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/sales/categories/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.categoriesData.remove({ id })
    return true
  })

  // File upload simulation
  server.post(`${apiPrefix}/sales/upload`, () => {
    // Simulate file upload
    const mockFileUrl = `/img/products/product-${Math.floor(Math.random() * 12) + 1}.jpg`
    return {
      success: true,
      url: mockFileUrl,
      filename: `uploaded-${Date.now()}.jpg`,
    }
  })
}
